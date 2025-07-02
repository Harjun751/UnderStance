const secrets = require("./secrets");
const { ManagementClient } = require("auth0");

const management = new ManagementClient({
  domain: secrets.getAuthDomain(),
  clientId: secrets.getAuthClientID(),
  clientSecret: secrets.getAuthClientSecret(),
});

module.exports = { management };
