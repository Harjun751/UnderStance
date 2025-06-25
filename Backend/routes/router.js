const express = require("express");
const routes = express.Router();
const { questionRoutes } = require("./questions.route.js");
const { stanceRoutes } = require("./stances.route.js");
const { categoryRoutes } = require("./categories.route.js");
const { partyRoutes } = require("./parties.route.js");
const config = require("../utils/app-config");
const { checkValidAccessToken } = require("../utils/auth0.middleware");

/* Auth for unsecured routes - checks if token is present,
 * but tokens are not required to access the routes */
routes.use(checkValidAccessToken);

/* Custom CORS middleware
 * Allows multiple origins, checks corsConfig origins
 * and allows if they match */
const corsConfig = {
	origins: [config.adminOrigin, config.frontendOrigin],
};
routes.use((req, res, next) => {
	const origin = req.headers.origin;
	if (corsConfig.origins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Vary", "Origin");
	}
	res.header("Access-Control-Allow-Methods", "GET");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.header("Access-Control-Allow-Credentials", true);
	return next();
});

routes.use(questionRoutes);
routes.use(stanceRoutes);
routes.use(partyRoutes);
routes.use(categoryRoutes);

module.exports = routes;
