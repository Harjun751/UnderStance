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

const realFetch = global.fetch;
const fakeFetch = jest.fn();
global.fetch = jest.fn((url, options) => {
	if (url.includes("auth0.com")) {
		return realFetch(url, options);
	} else {
		return fakeFetch(url, options);
	}
});
fakeFetch.mockResolvedValue({
	ok: true,
	headers: {
		get: (header) => (header === "content-type" ? "image/png" : null),
	},
});

const request = require("supertest");
jest.mock("../../utils/DAL");
const db = require("../../utils/DAL");
const app = require("../../app");

const parties = [
	{
		PartyID: 1,
		Name: "Coalition for Shakira",
		ShortName: "CFS",
		Icon: "https://cfs.com/icon.jpg",
		PartyColor: "#FFFFFF",
		Active: true,
	},
	{
		PartyID: 2,
		Name: "Traditionalist's Party",
		ShortName: "TP",
		Icon: "https://tp.com/icon.jpg",
		PartyColor: "#FFFFFF",
		Active: true,
	},
];

describe("authenticated mock GET party data", () => {
	test("should return 200 OK", () => {
		db.getParties.mockResolvedValue(parties);
		return request(app)
			.get("/parties")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body).toEqual(parties);
				expect(db.getParties).toHaveBeenLastCalledWith(true);
			});
	});

	test("should return 500 if DB error", () => {
		db.getParties.mockRejectedValue(new Error("DB error"));
		return request(app)
			.get("/parties")
			.then((response) => {
				expect(response.statusCode).toBe(500);
				expect(response.body).toEqual({
					error: "Failed to fetch parties",
				});
				expect(db.getParties).toHaveBeenLastCalledWith(true);
			});
	});
});

describe("mock GET quiz party with filter", () => {
	test("should return 200 OK with 1 row", () => {
		db.getPartyWithID.mockResolvedValue(parties[0]);
		return request(app)
			.get("/parties?ID=1")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body).toEqual(parties[0]);
				expect(db.getPartyWithID).toHaveBeenCalledWith(true, 1);
			});
	});

	test("should return 200 OK with 0 row", () => {
		db.getPartyWithID.mockResolvedValue([]);
		return request(app)
			.get("/parties?ID=3")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body).toEqual([]);
				expect(db.getPartyWithID).toHaveBeenCalledWith(true, 3);
			});
	});

	test("should return 400 if invalid argument", () => {
		return request(app)
			.get("/parties?ID=abc")
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 500 if DB error", () => {
		db.getPartyWithID.mockRejectedValue(new Error("DB error"));
		return request(app)
			.get("/parties?ID=2")
			.then((response) => {
				expect(response.statusCode).toBe(500);
				expect(response.body).toEqual({
					error: "Failed to fetch parties",
				});
			});
	});
});

describe("authenticated mock POST party", () => {
	const fakeParty = {
		Name: "Dingus Party",
		ShortName: "DGP",
		Icon: "https://url.com",
		PartyColor: "#FFFFF",
		Active: false,
	};

	test("should return 200 OK", () => {
		db.insertParty.mockResolvedValue(12);
		return request(app)
			.post("/parties")
			.send(fakeParty)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.PartyID).toEqual(12);
				expect(db.insertParty).toHaveBeenLastCalledWith(
					fakeParty.Name,
					fakeParty.ShortName,
					fakeParty.Icon,
					fakeParty.PartyColor,
					fakeParty.Active,
				);
			});
	});

	test("should return 400 if missing arguments", () => {
		return request(app)
			.post("/parties")
			.send({
				Name: fakeParty.Name,
			})
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 400 if invalid argument", () => {
		const fakeCopy = { ...fakeParty };
		fakeCopy.Name = `
            This is a name > 100 characters long

            Fingleborp nooned at an old campsite not too far off the trail. He placed the hobbles on his bay horse and took from his sack some tortillas and beans prepared days before in the kitchen of his hosts. He then ate.
        `;
		return request(app)
			.post("/parties")
			.send(fakeCopy)
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 500 if DB error", () => {
		db.insertParty.mockRejectedValue(new Error("DB error"));
		return request(app)
			.post("/parties")
			.send(fakeParty)
			.then((response) => {
				expect(response.statusCode).toBe(500);
				expect(response.body).toEqual({
					error: "Failed to insert party",
				});
				expect(db.insertParty).toHaveBeenLastCalledWith(
					fakeParty.Name,
					fakeParty.ShortName,
					fakeParty.Icon,
					fakeParty.PartyColor,
					fakeParty.Active,
				);
			});
	});
});

describe("authenticated mock PUT party", () => {
	const fakeParty = {
		PartyID: 1,
		Name: "Dingus Party",
		ShortName: "DGP",
		Icon: "https://url.com",
		PartyColor: "#FFFFF",
		Active: false,
	};

	test("should return 200 OK", () => {
		db.updateParty.mockResolvedValue(fakeParty);
		return request(app)
			.put("/parties")
			.send(fakeParty)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body).toEqual(fakeParty);
				expect(db.updateParty).toHaveBeenLastCalledWith(
					fakeParty.PartyID,
					fakeParty.Name,
					fakeParty.ShortName,
					fakeParty.Icon,
					fakeParty.PartyColor,
					fakeParty.Active,
				);
			});
	});

	test("should return 404 for invalid resource", () => {
		db.updateParty.mockRejectedValue(new Error("Invalid Resource"));
		return request(app)
			.put("/parties")
			.send(fakeParty)
			.then((response) => {
				expect(response.statusCode).toBe(404);
				expect(response.body).toEqual({
					error: "Could not update party with requested ID",
				});
			});
	});

	test("should return 400 if missing arguments", () => {
		return request(app)
			.put("/parties")
			.send({
				Name: fakeParty.Name,
			})
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 400 if invalid argument", () => {
		const fakeCopy = { ...fakeParty };
		fakeCopy.Name = `
            This is a name > 100 characters long

            Fingleborp nooned at an old campsite not too far off the trail. He placed the hobbles on his bay horse and took from his sack some tortillas and beans prepared days before in the kitchen of his hosts. He then ate.
        `;
		return request(app)
			.put("/parties")
			.send(fakeCopy)
			.then((response) => {
				expect(response.statusCode).toBe(400);
				expect(response.body).toMatchObject({
					error: "Invalid Arguments",
				});
			});
	});

	test("should return 500 if DB error", () => {
		db.updateParty.mockRejectedValue(new Error("DB error"));
		return request(app)
			.put("/parties")
			.send(fakeParty)
			.then((response) => {
				expect(response.statusCode).toBe(500);
				expect(response.body).toEqual({
					error: "Failed to update party",
				});
				expect(db.updateParty).toHaveBeenLastCalledWith(
					fakeParty.PartyID,
					fakeParty.Name,
					fakeParty.ShortName,
					fakeParty.Icon,
					fakeParty.PartyColor,
					fakeParty.Active,
				);
			});
	});
});

describe("authenticated mock DELETE party", () => {
	test("should return 200 OK", () => {
		db.deleteParty.mockResolvedValue({ rowCount: 1 });
		return request(app)
			.delete("/parties/1")
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body).toEqual({
					message: "Successfully deleted",
				});
				expect(db.deleteParty).toHaveBeenLastCalledWith(1);
			});
	});

	test("should return 400 if invalid param", () => {
		db.deleteParty.mockResolvedValue({ rowCount: 0 });
		return request(app)
			.delete("/parties/dingus")
			.then((response) => {
				expect(response.statusCode).toBe(400);
			});
	});

	test("should return 404 if no valid resource", async () => {
		db.deleteParty.mockRejectedValue(new Error("Invalid Resource"));
		return request(app)
			.delete("/parties/13000")
			.then((response) => {
				expect(response.statusCode).toBe(404);
				expect(db.deleteParty).toHaveBeenLastCalledWith(13000);
			});
	});

	test("should return 500 if DB error", () => {
		db.deleteParty.mockRejectedValue(new Error("DB error"));
		return request(app)
			.delete("/parties/1")
			.then((response) => {
				expect(response.statusCode).toBe(500);
				expect(response.body).toEqual({
					error: "Failed to delete party",
				});
				expect(db.deleteParty).toHaveBeenLastCalledWith(1);
			});
	});
});
