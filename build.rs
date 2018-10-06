extern crate protoc_rust;

use protoc_rust::Customize;

fn main() {
    protoc_rust::run(protoc_rust::Args {
        out_dir: "src/proto",
        input: &[
            "proto/authenticate.proto",
            "proto/email.proto",
            "proto/entry.proto",
            "proto/inbox.proto",
        ],
        includes: &["proto"],
        customize: Customize {
            ..Default::default()
        },
    })
    .expect("protoc");
}
