use crate::schema::request_logs;
use crate::Conn;
use chrono::{DateTime, Utc};
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Insertable)]
#[table_name = "request_logs"]
pub struct RequestInsert<'a> {
    pub url: &'a str,
    pub headers: String,
    pub created_on: DateTime<Utc>,
}

impl<'a> RequestInsert<'a> {
    pub fn save(self, conn: &Conn) -> Result<Uuid, failure::Error> {
        diesel::insert_into(request_logs::table)
            .values(self)
            .returning(request_logs::dsl::id)
            .get_result(conn)
            .map_err(Into::into)
    }
}

pub struct FinalizeRequest {
    id: Uuid,
    pub status: u16,
    pub finished_on: DateTime<Utc>,
}

impl FinalizeRequest {
    pub fn create(id: Uuid) -> FinalizeRequest {
        FinalizeRequest {
            id,
            status: 0,
            finished_on: chrono::MIN_DATE.and_hms(0, 0, 0),
        }
    }

    pub fn save(self, conn: &Conn) -> Result<(), failure::Error> {
        diesel::update(request_logs::table.find(self.id))
            .set((
                request_logs::dsl::response_code.eq(Some(i32::from(self.status))),
                request_logs::dsl::finished_on.eq(Some(self.finished_on)),
            ))
            .execute(conn)?;
        Ok(())
    }
}
