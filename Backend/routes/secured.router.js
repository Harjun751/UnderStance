const express = require("express");
const cors = require("cors");
const { securedQuestionRoutes } = require("./questions.route.js");
const { securedStanceRoutes } = require("./stances.route.js");
const { securedCategoryRoutes } = require("./categories.route.js");
const { securedPartyRoutes } = require("./parties.route.js");
const analyticsRoutes = require("./analytics.route.js");
const { securedUserRoutes } = require("./users.route.js");
const config = require("../utils/app-config");
const { requireValidAccessToken } = require("../utils/auth0.middleware");
const securedRoutes = express.Router();

securedRoutes.use(
    express.json(),
    /* CORS */
    cors({
        origin: config.adminOrigin,
        methods: ["PATCH", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
    /* Auth middleware that REQUIRES auth token */
    requireValidAccessToken,
);

securedRoutes.use(securedQuestionRoutes);
securedRoutes.use(securedStanceRoutes);
securedRoutes.use(securedPartyRoutes);
securedRoutes.use(securedCategoryRoutes);
securedRoutes.use(analyticsRoutes);
securedRoutes.use(securedUserRoutes);

securedRoutes.get("/authorized", async (req, res) => {
    const auth = req.auth;
    res.status(200).send({
        message: "successfully authorized!",
        token: auth.token,
    });
});

module.exports = securedRoutes;
