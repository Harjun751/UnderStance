const express = require("express");
const securedDashboardRoutes = express.Router();
const validator = require("../utils/input-validation");
const logger = require("../utils/logger");
const { management } = require("../utils/management-client");
const db = require("../utils/DAL");

securedDashboardRoutes.get(
    "/me/dashboard",
    async (req, res) => {
        try {
            const dashData = await db.getDashboard(req.auth.sub);
            res.status(200).send(dashData);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({ error: "Failed to fetch dashboard data" });
        }
    },
);
module.exports = { securedDashboardRoutes };
