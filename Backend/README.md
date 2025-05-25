# UnderStance Backend
Built with ExpressJS. Run with:
```
npm install
node backend.js
```
(requires mysql database running on host 3306)

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

## API reference
| Method    | Endpoint   |   Description   | Example Output | 
|-----------|------------|-----------------|----------------|
|GET        | /questions(?ID={}) | Returns whole list of issues (questions) | [{"IssueID":1,"Description":"Change national anthem to hip's don't lie","Summary":"On the anthem"}] | 

(I'll make this nicer soon (tm))
