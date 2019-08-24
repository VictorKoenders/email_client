#!/bin/bash
set -ex

cd web
cargo +nightly web build --release

cd ../server
cargo +nightly build --release

mkdir -p target/release/
cp -r ../web/static .
cp ../target/wasm32-unknown-unknown/release/web.js static/
cp ../target/wasm32-unknown-unknown/release/web.wasm static/
cp ../target/release/server target/release/

docker build -t email_client .
cd ../
docker save email_client --output email_client.tar

