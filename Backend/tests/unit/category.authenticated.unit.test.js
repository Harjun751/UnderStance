jest.mock("express-oauth2-jwt-bearer", () => ({
	auth: jest.fn(() => (req, _res, next) => {
		req.auth = {
			sub: "user-123",
			scope: "read:messages",
		};
		next();
	}),
}));

const middleware = require("../../utils/auth0.middleware");
jest
	.spyOn(middleware, "checkRequiredPermissions")
	.mockImplementation((_requiredPermissions) => {
		return (_req, _res, next) => {
			next();
		};
	});

const request = require("supertest");
jest.mock("../../utils/DAL");
const db = require("../../utils/DAL");
const app = require("../../app");

describe("authenticated mock POST category", () => {
	const fakeCategory = {
		Name: "Dingus Wingus",
	};

	test("should return 200 OK", () => {
		db.insertCategory.mockResolvedValue(12);
		return request(app)
			.post("/categories")
			.send(fakeCategory)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.CategoryID).toEqual(12);
				expect(db.insertCategory).toHaveBeenLastCalledWith(fakeCategory.Name);
			});
	});

	test("should return 400 if missing arguments", () => {
		return request(app)
			.post("/categories")
			.send({})
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 400 if invalid argument", () => {
		const fakeCopy = { ...fakeCategory };
		fakeCopy.Name = `
            This is a name > 50 characters long

            For instance, on the planet Earth, man had always assumed that he was more intelligent than dolphins because he had achieved so much—the wheel, New York, wars and so on—whilst all the dolphins had ever done was muck about in the water having a good time. But conversely, the dolphins had always believed that they were far more intelligent than man—for precisely the same reasons.
        `;
		return request(app)
			.post("/categories")
			.send(fakeCopy)
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 500 if DB error", () => {
		db.insertCategory.mockRejectedValue(new Error("DB error"));
		return request(app)
			.post("/categories")
			.send(fakeCategory)
			.then((response) => {
				expect(response.statusCode).toBe(500);
				expect(response.body).toEqual({
					error: "Failed to insert category",
				});
				expect(db.insertCategory).toHaveBeenLastCalledWith(fakeCategory.Name);
			});
	});
});

describe("authenticated mock PUT Category", () => {
	const fakeCategory = {
		CategoryID: 1,
		Name: "New Dingus",
	};

	test("should return 200 OK", () => {
		db.updateCategory.mockResolvedValue(fakeCategory);
		return request(app)
			.put("/categories")
			.send(fakeCategory)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body).toEqual(fakeCategory);
				expect(db.updateCategory).toHaveBeenLastCalledWith(
					fakeCategory.CategoryID,
					fakeCategory.Name,
				);
			});
	});

	test("should return 404 for missing value", () => {
		db.updateCategory.mockRejectedValue(new Error("Invalid Resource"));
		return request(app)
			.put("/categories")
			.send(fakeCategory)
			.then((response) => {
				expect(response.body).toEqual({
					error: "Could not update category with requested ID",
				});
				expect(response.statusCode).toBe(404);
			});
	});

	test("should return 400 if missing arguments", () => {
		return request(app)
			.put("/categories")
			.send({
				Name: fakeCategory.Name,
			})
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 400 if invalid argument", () => {
		const fakeCopy = { ...fakeCategory };
		fakeCopy.Name = `
            This is a name > 50 characters long

            Fingleborp nooned at an old campsite not too far off the trail. He placed the hobbles on his bay horse and took from his sack some tortillas and beans prepared days before in the kitchen of his hosts. He then ate.
        `;
		return request(app)
			.put("/categories")
			.send(fakeCopy)
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 500 if DB error", () => {
		db.updateCategory.mockRejectedValue(new Error("DB error"));
		return request(app)
			.put("/categories")
			.send(fakeCategory)
			.then((response) => {
				expect(response.statusCode).toBe(500);
				expect(response.body).toEqual({
					error: "Failed to update category",
				});
				expect(db.updateCategory).toHaveBeenLastCalledWith(
					fakeCategory.CategoryID,
					fakeCategory.Name,
				);
			});
	});
});

describe("authenticated mock DELETE Category", () => {
	test("should return 200 OK", () => {
		db.deleteCategory.mockResolvedValue({ rowCount: 1 });
		return request(app)
			.delete("/categories/1")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body).toEqual({
					message: "Successfully deleted",
				});
				expect(db.deleteCategory).toHaveBeenLastCalledWith(1);
			});
	});

	test("should return 400 if invalid param", () => {
		db.deleteCategory.mockResolvedValue({ rowCount: 0 });
		return request(app)
			.delete("/categories/dingus")
			.then((response) => {
				expect(response.statusCode).toBe(400);
			});
	});

	test("should return 400 if still has issues referencing category", () => {
		db.deleteCategory.mockRejectedValue(
			new Error("Foreign Key Constraint Violation"),
		);
		return request(app)
			.delete("/categories/1")
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toEqual({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 404 if no valid resource", async () => {
		db.deleteCategory.mockRejectedValue(new Error("Invalid Resource"));
		return request(app)
			.delete("/categories/13000")
			.then((response) => {
				expect(response.statusCode).toBe(404);
				expect(db.deleteCategory).toHaveBeenLastCalledWith(13000);
			});
	});

	test("should return 500 if DB error", () => {
		db.deleteCategory.mockRejectedValue(new Error("DB error"));
		return request(app)
			.delete("/categories/1")
			.then((response) => {
				expect(response.statusCode).toBe(500);
				expect(response.body).toEqual({
					error: "Failed to delete category",
				});
				expect(db.deleteCategory).toHaveBeenLastCalledWith(1);
			});
	});
});
