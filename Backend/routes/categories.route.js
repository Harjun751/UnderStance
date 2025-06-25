const express = require("express");
const categoryRoutes = express.Router();
const securedCategoryRoutes = express.Router();
const db = require("./../utils/DAL");
const validator = require("./../utils/input-validation");
const logger = require("../utils/logger");
const {
	permissions,
	checkRequiredPermissions,
} = require("../utils/auth0.middleware.js");

categoryRoutes.get("/categories", async (_req, res) => {
	try {
		const data = await db.getCategories();
		res.status(200).send(data);
	} catch (error) {
		logger.error(error.stack);
		res.status(500).send({ error: "Failed to fetch categories" });
	}
});

securedCategoryRoutes.post(
	"/categories",
	checkRequiredPermissions([permissions.write]),
	async (req, res) => {
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
	},
);

securedCategoryRoutes.put(
	"/categories",
	checkRequiredPermissions([permissions.write]),
	async (req, res) => {
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
	},
);

securedCategoryRoutes.delete(
	"/categories/:id",
	checkRequiredPermissions([permissions.delete]),
	async (req, res) => {
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
	},
);

module.exports = { categoryRoutes, securedCategoryRoutes };
