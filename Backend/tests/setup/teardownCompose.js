const { execSync } = require("child_process");

module.exports = async function teardownCompose() {
  console.log("Tearing down Docker Compose...");
  execSync("docker compose -f tests/setup/docker-compose.test.yml down -v", { stdio: "inherit" });
};

