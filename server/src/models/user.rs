use super::{schema::user, Connection, Result, Uuid};
use diesel::prelude::*;

#[derive(Queryable)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    password: String,
    pub token: Option<Uuid>,
}
const PASSWORD_ITERATIONS: u32 = 100_000;

#[derive(Insertable, Debug)]
#[table_name = "user"]
struct UserInsert<'a> {
    name: &'a str,
    password: &'a str,
}

impl User {
    pub fn create(conn: &Connection, user_name: &str, password: &str) -> Result<()> {
        let password = pbkdf2::pbkdf2_simple(password, PASSWORD_ITERATIONS)?;
        let insert = UserInsert {
            name: user_name,
            password: &password,
        };
        diesel::insert_into(user::table)
            .values(&insert)
            .execute(conn)?;
        Ok(())
    }

    pub fn generate_token(&mut self, conn: &Connection) -> Result<Uuid> {
        let token = uuid::Uuid::new_v4();
        diesel::update(user::table.find(self.id))
            .set(user::dsl::auth_token.eq(Some(token)))
            .execute(conn)?;
        Ok(token)
    }

    pub fn load_by_name(conn: &Connection, user_name: &str) -> Result<Option<User>> {
        user::table
            .filter(user::dsl::name.eq(user_name))
            .get_result(conn)
            .optional()
            .map_err(Into::into)
    }

    pub fn load_by_token(conn: &Connection, token: Uuid) -> Result<Option<User>> {
        user::table
            .filter(user::dsl::auth_token.eq(token))
            .get_result(conn)
            .optional()
            .map_err(Into::into)
    }

    pub fn validate_password(&self, password: &str) -> bool {
        pbkdf2::pbkdf2_check(password, &self.password).is_ok()
    }
}
