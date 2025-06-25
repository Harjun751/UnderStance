const express = require("express");
const questionRoutes = express.Router();
const securedQuestionRoutes = express.Router();
const db = require("../utils/DAL");
const validator = require("../utils/input-validation");
const logger = require("../utils/logger");
const {
	permissions,
	checkRequiredPermissions,
} = require("../utils/auth0.middleware.js");

questionRoutes.get("/questions", async (req, res) => {
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

securedQuestionRoutes.post(
	"/questions",
	checkRequiredPermissions([permissions.write]),
	async (req, res) => {
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
				res.status(400).send({
					error: "Invalid Arguments",
					details: "Invalid CategoryID supplied",
				});
			}
			logger.error(error.stack);
			res.status(500).send({ error: "Failed to insert question" });
		}
	},
);

securedQuestionRoutes.put(
	"/questions",
	checkRequiredPermissions([permissions.write]),
	async (req, res) => {
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
				res.status(400).send({
					error: "Invalid Arguments",
					details: "Invalid CategoryID supplied",
				});
			} else {
				logger.error(error.stack);
				res.status(500).send({ error: "Failed to update question" });
			}
		}
	},
);

securedQuestionRoutes.delete(
	"/questions/:id",
	checkRequiredPermissions([permissions.delete]),
	async (req, res) => {
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
	},
);

module.exports = { questionRoutes, securedQuestionRoutes };
