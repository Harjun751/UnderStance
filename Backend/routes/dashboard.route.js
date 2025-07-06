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
            let dashData = await db.getDashboard(req.auth.payload.sub);
            if (dashData === null) {
                dashData = {};
            }
            res.status(200).send(dashData);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({ error: "Failed to fetch dashboard data" });
        }
    },
);

securedDashboardRoutes.put(
    "/me/dashboard",
    async (req, res) => {
        // console.log("Received req.body:", req.body);
        const validators = {
            Overall: validator.validateJSON,
            Tabs: validator.validateJSON,
        };
        const errors = validator.validateData(validators, req.body);
        if (errors !== null) {
            return res
                .status(400)
                .send({ error: "Invalid Arguments", details: errors });
        }

        try {
            const overall = req.body.Overall;
            const tabs = req.body.Tabs;
            const userID = req.auth.payload.sub;
            const hasData = await db.getDashboard(userID);
            let func;
            if (!hasData) {
                func = async () => await db.createDashboard(userID, overall, tabs);
            } else {
                func = async () => await db.updateDashboard(userID, overall, tabs);
            }
            const data = await func();
            res.status(200).send(data);
        } catch (err) {
            if (err.message === "Invalid JSON text") {
                return res.status(400).send({ error: err.message });
            }
            logger.error(err.stack);
            res.status(500).send({ error: "Failed to update dashboard data", body: err.stack, dingus: JSON.stringify(req.body) });
        }
    },
);

module.exports = { securedDashboardRoutes };
