const app = require("../../app");
const request = require("supertest");
jest.mock("../../utils/DAL");
const db = require("../../utils/DAL");

const parties = [
    {
        PartyID: 1,
        Name: "Coalition for Shakira",
        ShortName: "CFS",
        Icon: "https://cfs.com/icon.jpg",
    },
    {
        PartyID: 2,
        Name: "Traditionalist's Party",
        ShortName: "TP",
        Icon: "https://tp.com/icon.jpg",
    },
];

describe("mock GET party", () => {
    test("should return 200 OK", () => {
        db.getParties.mockResolvedValue(parties);
        return request(app)
            .get("/parties")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(parties);
                expect(db.getParties).toHaveBeenLastCalledWith(false);
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
                expect(db.getParties).toHaveBeenLastCalledWith(false);
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
                expect(db.getPartyWithID).toHaveBeenCalledWith(false, 1);
            });
    });

    test("should return 200 OK with 0 row", () => {
        db.getPartyWithID.mockResolvedValue([]);
        return request(app)
            .get("/parties?ID=3")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual([]);
                expect(db.getPartyWithID).toHaveBeenCalledWith(false, 3);
            });
    });

    test("should return 400 if invalid argument", () => {
        return request(app)
            .get("/parties?ID=abc")
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual({ error: "Invalid Arguments" });
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
