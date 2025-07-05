const express = require("express");
const app = express();
const routes = require("./routes/router");
const securedRoutes = require("./routes/secured.router");
const analyticsRoutes = require("./routes/analytics.route");

const fs = require("fs");

const morgan = require("morgan");

app.use(morgan("combined"));

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

// prevent favico GET from leaking to secured routes
app.get("/favicon.ico", (_req, res) => res.status(204).end());

app.use(routes);
app.use(securedRoutes);


module.exports = app;
