use flate2::write::GzEncoder;
use flate2::Compression;
use rocket::{fairing, Request, Response};
use std::io::{Cursor, Write};

pub struct Gzip;

impl fairing::Fairing for Gzip {
    fn info(&self) -> fairing::Info {
        fairing::Info {
            name: "Gzip compression",
            kind: fairing::Kind::Response,
        }
    }

    fn on_response(&self, request: &Request, response: &mut Response) {
        let headers = request.headers();
        if !headers
            .get("Accept-Encoding")
            .any(|e| e.to_lowercase().contains("gzip"))
        {
            return;
        }
        if let Some(body) = response.body_bytes() {
            let new_body = Cursor::new(if body.is_empty() {
                body
            } else {
                let old_len = body.len() as isize;
                let writer = Vec::with_capacity(body.len());
                let mut encoder = GzEncoder::new(writer, Compression::default());
                if let Ok(writer) = encoder.write_all(&body).and_then(|()| encoder.finish()) {
                    response.set_raw_header("Content-Encoding", "gzip");
                    let new_len = writer.len() as isize;
                    println!(
                        "gzip compression {}% ({} -> {})",
                        100 - (new_len * 100 / old_len),
                        old_len,
                        new_len
                    );
                    writer
                } else {
                    body
                }
            });
            response.set_sized_body(new_body);
        }
    }
}
