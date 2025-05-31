const { execSync } = require("child_process");
const waitOn = require("wait-on");

module.exports = async function setupCompose(port) {
  const intPort = parseInt(port);
  console.log("Starting Docker Compose...");
  execSync(
    `docker compose -p ${intPort} -f tests/setup/docker-compose.test.yml up --build -d`,
    {
      stdio: "inherit",
      env: { ...process.env, BACKEND_UNDERSTANCE_PORT: `${intPort}` },
    },
  );

  console.log("Waiting on service...");
  await waitOn({
    resources: [`http-get://localhost:${intPort}/questions`],
    timeout: 30000,
    validateStatus: (status) => status === 200,
  });
  console.log("Backend Ready!");
};
