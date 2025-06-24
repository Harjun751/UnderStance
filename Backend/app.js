const express = require("express");
const db = require("./services/DAL");
const validator = require("./services/InputValidation");
const logger = require("./logger");
const app = express();
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");

const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5174";
const adminOrigin = process.env.ADMIN_ORIGIN || "http://localhost:5173";
const issuerBaseUrl =
    process.env.ISSUER_BASE_URL || "https://dev-i0ksanu2a66behjf.us.auth0.com/";
const audience =
    process.env.AUDIENCE || "https://understance-backend.onrender.com/";

const corsConfig = {
    origins: [adminOrigin, frontendOrigin],
};

/* Intercept all requests and check if valid origin in list
 * Then set cors header accordingly                         */
app.use((req, res, next) => {
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

// Auth middleware that doesn't enforce
app.use(
    auth({
        issuerBaseURL: issuerBaseUrl,
        audience: audience,
        tokenSigningAlg: "RS256",
        authRequired: false,
    }),
);

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

app.get("/questions", async (req, res) => {
    const isAuthenticated = req.auth !== undefined;
    const id = req.query.ID;
    if (id === undefined) {
        try {
            const data = await db.getQuestions(isAuthenticated);
            res.status(200).send(data);
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to fetch questions" });
        }
    } else {
        if (!Number.isNaN(Number(id))) {
            try {
                const data = await db.getQuestionWithID(
                    isAuthenticated,
                    Number.parseInt(id),
                );
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
    const isAuthenticated = req.auth !== undefined;
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
            const data = await db.getStances(isAuthenticated);
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
                    isAuthenticated,
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
    const isAuthenticated = req.auth !== undefined;
    const id = req.query.ID;
    if (id === undefined) {
        // simply return all
        try {
            const data = await db.getParties(isAuthenticated);
            res.status(200).send(data);
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to fetch parties" });
        }
    } else {
        if (!Number.isNaN(Number(id))) {
            try {
                const data = await db.getPartyWithID(
                    isAuthenticated,
                    Number.parseInt(id),
                );
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

app.get("/categories", async (_req, res) => {
    try {
        const data = await db.getCategories();
        res.status(200).send(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(500).send({ error: "Failed to fetch categories" });
    }
});

const securedRoutes = express.Router();

/* middleware to parse req.body */
securedRoutes.use(express.json());

securedRoutes.use(
    cors({
        origin: adminOrigin,
        methods: ["GET", "POST"],
    }),
    auth({
        issuerBaseURL: issuerBaseUrl,
        audience: audience,
        tokenSigningAlg: "RS256",
    }),
);

securedRoutes.get("/authorized", async (req, res) => {
    const auth = req.auth;
    res.status(200).send({
        message: "successfully authorized!",
        token: auth.token,
    });
});

securedRoutes.post("/questions", async (req, res) => {
    const body = req.body;
    const validators = {
        Description: validator.validateDescription,
        Summary: validator.validateSummary,
        CategoryID: validator.validateID,
        Active: validator.validateActive,
    };
    const errors = validator.validateData(validators, req.body);
    if (errors !== null) {
        return res
            .status(400)
            .send({ error: "Invalid Arguments", details: errors });
    }

    try {
        const data = await db.insertQuestion(
            body.Description,
            body.Summary,
            body.CategoryID,
            validator.convertToBoolean(body.Active),
        );
        res.status(200).send({ IssueID: data });
    } catch (error) {
        if (error.message === "Foreign Key Constraint Violation") {
            res.status(400).send({ error: "Invalid Arguments", details: "Invalid CategoryID supplied" });
        }
        logger.error(error.stack);
        res.status(500).send({ error: "Failed to insert question" });
    }
});

securedRoutes.put("/questions", async (req, res) => {
    const body = req.body;
    const validators = {
        Description: validator.validateDescription,
        Summary: validator.validateSummary,
        CategoryID: validator.validateID,
        IssueID: validator.validateID,
        Active: validator.validateActive,
    };
    const errors = validator.validateData(validators, req.body);
    if (errors !== null) {
        return res
            .status(400)
            .send({ error: "Invalid Arguments", details: errors });
    }

    try {
        const data = await db.updateQuestion(
            body.IssueID,
            body.Description,
            body.Summary,
            body.CategoryID,
            validator.convertToBoolean(body.Active),
        );
        res.status(200).send(data);
    } catch (error) {
        if (error.message === "Invalid Resource") {
            res.status(404).send({
                error: "Could not update question with requested ID",
            });
        } else if (error.message === "Foreign Key Constraint Violation") {
            res.status(400).send({ error: "Invalid Arguments", details: "Invalid CategoryID supplied" });
        } else {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to update question" });
        }
    }
});

securedRoutes.delete("/questions/:id", async (req, res) => {
    if (!Number.isNaN(Number(req.params.id))) {
        try {
            await db.deleteQuestion(Number.parseInt(req.params.id));
            res.status(200).send({ message: "Successfully deleted" });
        } catch (err) {
            if (err.message === "Invalid Resource") {
                res.status(404).send({
                    error: "Could not delete question with requested ID",
                });
            } else {
                logger.error(err.stack);
                res.status(500).send({ error: "Failed to delete question" });
            }
        }
    } else {
        res.status(400).send({ error: "Invalid Arguments" });
    }
});

securedRoutes.post("/parties", async (req, res) => {
    const body = req.body;

    const iconError = await validator.validateIcon(body.Icon);
    if (iconError != null) {
        return res
            .status(400)
            .send({
                error: "Invalid Arguments",
                details: `Invalid icon ${iconError}`,
            });
    }

    const validators = {
        Name: validator.validatePartyName,
        ShortName: validator.validateShortName,
        PartyColor: validator.validateColor,
        Active: validator.validateActive,
    };
    const errors = validator.validateData(validators, req.body);
    if (errors !== null) {
        return res
            .status(400)
            .send({ error: "Invalid Arguments", details: errors });
    }
    try {
        const data = await db.insertParty(
            body.Name,
            body.ShortName,
            body.Icon,
            body.PartyColor,
            validator.convertToBoolean(body.Active),
        );
        res.status(200).send({ PartyID: data });
    } catch (error) {
        logger.error(error.stack);
        res.status(500).send({ error: "Failed to insert party" });
    }
});

securedRoutes.put("/parties", async (req, res) => {
    const body = req.body;

    const iconError = await validator.validateIcon(body.Icon);
    if (iconError != null) {
        return res
            .status(400)
            .send({
                error: "Invalid Arguments",
                details: `Invalid icon filed ${iconError}`,
            });
    }

    const validators = {
        PartyID: validator.validateID,
        Name: validator.validatePartyName,
        ShortName: validator.validateShortName,
        PartyColor: validator.validateColor,
        Active: validator.validateActive,
    };
    const errors = validator.validateData(validators, req.body);
    if (errors !== null) {
        return res
            .status(400)
            .send({ error: "Invalid Arguments", details: errors });
    }
    try {
        const data = await db.updateParty(
            body.PartyID,
            body.Name,
            body.ShortName,
            body.Icon,
            body.PartyColor,
            validator.convertToBoolean(body.Active),
        );
        res.status(200).send(data);
    } catch (error) {
        if (error.message === "Invalid Resource") {
            res.status(404).send({
                error: "Could not update party with requested ID",
            });
        } else {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to update party" });
        }
    }
});

securedRoutes.delete("/parties/:id", async (req, res) => {
    if (!Number.isNaN(Number(req.params.id))) {
        try {
            await db.deleteParty(Number.parseInt(req.params.id));
            res.status(200).send({ message: "Successfully deleted" });
        } catch (err) {
            if (err.message === "Invalid Resource") {
                res.status(404).send({
                    error: "Could not delete party with requested ID",
                });
            } else {
                logger.error(err.stack);
                res.status(500).send({ error: "Failed to delete party" });
            }
        }
    } else {
        res.status(400).send({
            error: "Invalid Arguments",
            details: "ID parameter is not a valid number",
        });
    }
});

securedRoutes.post("/stances", async (req, res) => {
    const body = req.body;
    const validators = {
        Stand: validator.validateActive,
        Reason: validator.validateReason,
        IssueID: validator.validateID,
        PartyID: validator.validateID,
    };
    const errors = validator.validateData(validators, req.body);

    if (errors !== null) {
        return res
            .status(400)
            .send({ error: "Invalid Arguments", details: errors });
    }
    try {
        const data = await db.insertStance(
            validator.convertToBoolean(body.Stand),
            body.Reason,
            body.IssueID,
            body.PartyID,
        );
        res.status(200).send({ StanceID: data });
    } catch (error) {
        if (error.message === "Unique Constraint Violation") {
            res.status(400).send({
                error: "Invalid Arguments",
                details: "Party cannot have 2 stances on the same issue."
            });
        }
        logger.error(error.stack);
        res.status(500).send({ error: "Failed to insert stance" });
    }
});

securedRoutes.put("/stances", async (req, res) => {
    const body = req.body;

    const validators = {
        StanceID: validator.validateID,
        Stand: validator.validateActive,
        Reason: validator.validateReason,
        IssueID: validator.validateID,
        PartyID: validator.validateID,
    };
    const errors = validator.validateData(validators, req.body);

    if (errors !== null) {
        return res
            .status(400)
            .send({ error: "Invalid Arguments", details: errors });
    }
    try {
        const data = await db.updateStance(
            body.StanceID,
            validator.convertToBoolean(body.Stand),
            body.Reason,
            body.IssueID,
            body.PartyID,
        );
        res.status(200).send(data);
    } catch (error) {
        if (error.message === "Invalid Resource") {
            res.status(404).send({
                error: "Could not update stance with requested ID",
            });
        } else if (error.message === "Unique Constraint Violation") {
            res.status(400).send({
                error: "Invalid Arguments",
                details: "Each party should only have 1 stance per issue.",
            });
        } else {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to update stance" });
        }
    }
});

securedRoutes.delete("/stances/:id", async (req, res) => {
    if (!Number.isNaN(Number(req.params.id))) {
        try {
            await db.deleteStance(Number.parseInt(req.params.id));
            res.status(200).send({ message: "Successfully deleted" });
        } catch (err) {
            if (err.message === "Invalid Resource") {
                res.status(404).send({
                    error: "Could not delete stance with requested ID",
                });
            } else {
                logger.error(err.stack);
                res.status(500).send({ error: "Failed to delete stance" });
            }
        }
    } else {
        res.status(400).send({
            error: "Invalid Arguments",
            details: "ID parameter is not a valid number",
        });
    }
});

securedRoutes.post("/categories", async (req, res) => {
    const body = req.body;
    const validators = {
        Name: validator.validateCategory,
    };
    const errors = validator.validateData(validators, req.body);
    if (errors !== null) {
        return res
            .status(400)
            .send({ error: "Invalid Arguments", details: errors });
    }
    try {
        const data = await db.insertCategory(body.Name);
        res.status(200).send({ CategoryID: data });
    } catch (error) {
        logger.error(error.stack);
        res.status(500).send({ error: "Failed to insert category" });
    }
});

securedRoutes.put("/categories", async (req, res) => {
    const body = req.body;
    const validators = {
        CategoryID: validator.validateID,
        Name: validator.validateCategory,
    };
    const errors = validator.validateData(validators, req.body);
    if (errors !== null) {
        return res
            .status(400)
            .send({ error: "Invalid Arguments", details: errors });
    }
    try {
        const data = await db.updateCategory(body.CategoryID, body.Name);
        res.status(200).send(data);
    } catch (error) {
        if (error.message === "Invalid Resource") {
            res.status(404).send({
                error: "Could not update category with requested ID",
            });
        } else {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to update category" });
        }
    }
});

securedRoutes.delete("/categories/:id", async (req, res) => {
    if (!Number.isNaN(Number(req.params.id))) {
        try {
            await db.deleteCategory(Number.parseInt(req.params.id));
            res.status(200).send({ message: "Successfully deleted" });
        } catch (err) {
            if (err.message === "Invalid Resource") {
                res.status(404).send({
                    error: "Could not delete stance with requested ID",
                });
            } else if (err.message === "Foreign Key Constraint Violation") {
                res.status(400).send({ error: "Invalid Arguments" });
            } else {
                logger.error(err.stack);
                res.status(500).send({ error: "Failed to delete category" });
            }
        }
    } else {
        res.status(400).send({ error: "Invalid Arguments" });
    }
});

app.use(securedRoutes);

module.exports = app;
