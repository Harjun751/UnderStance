const express = require("express");
const stanceRoutes = express.Router();
const securedStanceRoutes = express.Router();
const db = require("../utils/DAL");
const validator = require("../utils/input-validation");
const logger = require("../utils/logger");
const {
	permissions,
	checkRequiredPermissions,
} = require("../utils/auth0.middleware.js");

stanceRoutes.get("/stances", async (req, res) => {
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

securedStanceRoutes.post(
	"/stances",
	checkRequiredPermissions([permissions.write]),
	async (req, res) => {
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
					details: "Party cannot have 2 stances on the same issue.",
				});
			}
			logger.error(error.stack);
			res.status(500).send({ error: "Failed to insert stance" });
		}
	},
);

securedStanceRoutes.put(
	"/stances",
	checkRequiredPermissions([permissions.write]),
	async (req, res) => {
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
	},
);

securedStanceRoutes.delete(
	"/stances/:id",
	checkRequiredPermissions([permissions.delete]),
	async (req, res) => {
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
	},
);

module.exports = { stanceRoutes, securedStanceRoutes };
