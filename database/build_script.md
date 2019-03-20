The build/deploy script should do the following:

- Build (obv)
- Test
- Release build
- Release test
- Copy binary to production
- Start against a random port
- Run some integration tests
- Shut down both new and old binary
- Copy new binary over old
- Run new binary

