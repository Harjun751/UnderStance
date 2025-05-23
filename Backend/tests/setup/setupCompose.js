const { execSync } = require("child_process");
const waitOn = require("wait-on");

module.exports = async function setupCompose() {
    console.log("Starting Docker Compose...");
    execSync("docker compose -f tests/setup/docker-compose.test.yml up -d", { stdio : "inherit" });

    console.log("Waiting on service...");
    await waitOn({
        resources: ["http-get://localhost:3001/"],
        timeout: 30000,
        validateStatus: status => status === 200
    });
    console.log("Backend Ready!");
};
