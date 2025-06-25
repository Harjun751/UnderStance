const express = require("express");
const partyRoutes = express.Router();
const securedPartyRoutes = express.Router();
const db = require("../utils/DAL");
const validator = require("../utils/input-validation");
const logger = require("../utils/logger");
const {
    permissions,
    checkRequiredPermissions,
} = require("../utils/auth0.middleware.js");

partyRoutes.get("/parties", async (req, res) => {
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

securedPartyRoutes.post(
    "/parties",
    checkRequiredPermissions([permissions.write]),
    async (req, res) => {
        const body = req.body;

        const iconError = await validator.validateIcon(body.Icon);
        if (iconError != null) {
            return res.status(400).send({
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
    },
);

securedPartyRoutes.put(
    "/parties",
    checkRequiredPermissions([permissions.write]),
    async (req, res) => {
        const body = req.body;

        const iconError = await validator.validateIcon(body.Icon);
        if (iconError != null) {
            return res.status(400).send({
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
    },
);

securedPartyRoutes.delete(
    "/parties/:id",
    checkRequiredPermissions([permissions.delete]),
    async (req, res) => {
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
    },
);

module.exports = { partyRoutes, securedPartyRoutes };
