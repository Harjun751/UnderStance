const express = require("express");
const db = require("./services/DAL");
const logger = require("./logger");
const app = express();
const cors = require("cors");
const { auth } = require('express-oauth2-jwt-bearer');

const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5174";
const adminOrigin = process.env.ADMIN_ORIGIN || "http://localhost:5173";
const issuerBaseUrl = process.env.ISSUER_BASE_URL || "https://dev-i0ksanu2a66behjf.us.auth0.com/";
const audience = process.env.AUDIENCE || "https://understance-backend.onrender.com/";

const corsConfig = {
    origins: [adminOrigin, frontendOrigin]
}

/* Intercept all requests and check if valid origin in list
 * Then set cors header accordingly                         */
app.use((req,res,next) => {
    let origin = req.headers.origin;
    if (corsConfig.origins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    }
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/questions", async (req, res) => {
    const id = req.query.ID;
    if (id === undefined) {
        // simply return all
        try {
            const data = await db.getQuestions();
            res.status(200).send(data);
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to fetch questions" });
        }
    } else {
        if (!Number.isNaN(Number(id))) {
            try {
                const data = await db.getQuestionWithID(Number.parseInt(id));
                res.status(200).send(data);
            } catch (error) {
                logger.error(error.stack);
                res.status(500).send({ error: "Failed to fetch questions" });
            }
        } else {
            res.status(400).send({ error: "Invalid Arguments" });
        }
    }
});

app.get("/stances", async (req, res) => {
    let StanceID = req.query.StanceID;
    let IssueID = req.query.IssueID;
    let PartyID = req.query.PartyID;
    if (
        StanceID === undefined &&
        IssueID === undefined &&
        PartyID === undefined
    ) {
        // return all
        try {
            const data = await db.getStances();
            res.status(200).send(data);
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to fetch stances" });
        }
    } else {
        // Convert undefined values into null
        StanceID = StanceID ?? null;
        IssueID = IssueID ?? null;
        PartyID = PartyID ?? null;
        // Check if they are invalid as numbers
        if (
            Number.isNaN(Number(StanceID)) ||
            Number.isNaN(Number(IssueID)) ||
            Number.isNaN(Number(PartyID))
        ) {
            res.status(400).send({ error: "Invalid Arguments" });
        } else {
            try {
                // parseInt(null) == NaN
                // We want to pass null if filter is not being used
                // so coerce into null if required with ||
                const data = await db.getStancesFiltered(
                    Number.parseInt(StanceID) || null,
                    Number.parseInt(IssueID) || null,
                    Number.parseInt(PartyID) || null,
                );
                res.status(200).send(data);
            } catch (error) {
                logger.error(error.stack);
                res.status(500).send({ error: "Failed to fetch stances" });
            }
        }
    }
});

app.get("/parties", async (req, res) => {
    const id = req.query.ID;
    if (id === undefined) {
        // simply return all
        try {
            const data = await db.getParties();
            res.status(200).send(data);
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to fetch parties" });
        }
    } else {
        if (!Number.isNaN(Number(id))) {
            try {
                const data = await db.getPartyWithID(Number.parseInt(id));
                res.status(200).send(data);
            } catch (error) {
                logger.error(error.stack);
                res.status(500).send({ error: "Failed to fetch parties" });
            }
        } else {
            res.status(400).send({ error: "Invalid Arguments" });
        }
    }
});

const securedRoutes = express.Router();

securedRoutes.use(
    cors({
        origin: adminOrigin,
        methods: ["GET", "POST"],
    }),
    auth({
        issuerBaseURL: issuerBaseUrl,
        audience: audience,
        tokenSigningAlg: 'RS256'
    })
);

securedRoutes.get("/authorized", async (req, res) => {
    const auth = req.auth;
    res.status(200).send({ message: "successfully authorized!", token: auth.token });
});


app.use(securedRoutes);

module.exports = app;
