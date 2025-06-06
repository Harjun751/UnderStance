const { execSync } = require("child_process");

module.exports = async function teardownCompose(appPort) {
    const intPort = parseInt(appPort);
    console.log("Tearing down Docker Compose...");
    execSync(
        `docker compose -p ${intPort}  -f tests/setup/docker-compose.test.yml down -v`,
        { stdio: "inherit" },
    );
};
