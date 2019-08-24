FROM ubuntu:19.04

RUN apt update && \
    apt upgrade -y && \
    apt install libssl-dev openssl libpq-dev ca-certificates  -y && \
    rm -rf /var/lib/apt/lists/*


COPY target/release/server /email_client
COPY static /static

ENTRYPOINT ["/email_client"]

