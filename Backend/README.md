[![codecov](https://codecov.io/gh/Harjun751/UnderStance/graph/badge.svg?token=8ROQPVNQY8)](https://codecov.io/gh/Harjun751/UnderStance)
# API Docs
View API documentation on [swaggerhub here](https://app.swaggerhub.com/apis/harjun7517/under-stance_backend_api/0.1.0)
# UnderStance Backend
Built with ExpressJS. Run with:
```
npm install
node backend.js
```
(requires postgres database running)

Or use docker compose:
```
docker compose -f ../compose.yaml up // binds to port 3000 on host
// or use the test config:
docker compose -f ./tests/setup/docker-compose.test.yml up // binds to port 3001
```

## Testing
Tests are run using jest. To run the unit tests:
```
npm test
```

To run the full suite of tests:
```
npm run testall
```
**Note**: The integration tests spin up containers using docker to perform tests with. This means that you likely require elevated privileges to prevent permission errors with docker when running the test.

To run with code coverage:
```
npm run testcov
```
Coverage files are generated in ./coverage


## Logging
Logging is done using Winston and Morgan. Error files are located in ./logs/error.log
