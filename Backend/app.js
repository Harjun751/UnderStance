const express = require("express");
const app = express();
const routes = require("./routes/router");
const securedRoutes = require("./routes/secured.router");
const analyticsRoutes = require("./routes/analytics.route");

const fs = require("fs");

function loadSecret(path) {
    try {
        return fs.readFileSync(path, "utf-8").trim();
    } catch (err) {
        console.error(`Error reading secret from ${path}`);
        return undefined;
    }
}

// Only load if running in Docker with secrets mounted
if (!process.env.GA4_SERVICE_ACCOUNT_JSON && fs.existsSync("/run/secrets/ga4_service_account")) {
    process.env.GA4_SERVICE_ACCOUNT_JSON = loadSecret("/run/secrets/ga4_service_account");
    process.env.GA4_PROPERTY_ID = loadSecret("/run/secrets/ga4_property_id");
}

//REMINDER COMMENT THIS OUT AFTER DONE DEBUGGING BLESS!!!!!!!!!!!!!!!!!!!!!
console.log("GA4_PROPERTY_ID:", process.env.GA4_PROPERTY_ID);

console.log("GA4 loaded:", process.env.GA4_SERVICE_ACCOUNT_JSON?.length > 100);

console.log("GA4 env length:", process.env.GA4_SERVICE_ACCOUNT_JSON?.length);

const morgan = require("morgan");

app.use(morgan("combined"));

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

//THIS IS A REMINDER TO ADD IT TO THE SECURED ROUTE
app.use("/api/analytics", analyticsRoutes);

// prevent favico GET from leaking to secured routes
app.get("/favicon.ico", (_req, res) => res.status(204).end());

app.use(routes);
app.use(securedRoutes);


module.exports = app;
