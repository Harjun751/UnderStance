const app = require("../../app");
const request = require("supertest");
jest.mock("../../services/DAL");
const db = require("../../services/DAL");

const fakeStances = [
    {
        StanceID: 1,
        Stand: true,
        Reason: "Who can argue against such a banger",
        IssueID: 1,
        PartyID: 1,
    },
    {
        StanceID: 2,
        Stand: false,
        Reason: "I think our national anthem is perfectly fine",
        IssueID: 1,
        PartyID: 2,
    },
];

describe("mock GET stances", () => {
    test("should return 200 OK", () => {
        db.getStances.mockResolvedValue(fakeStances);
        return request(app)
            .get("/stances")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeStances);
            });
    });

    test("should return 500 if DB error", () => {
        db.getStances.mockRejectedValue(new Error("DB error"));
        return request(app)
            .get("/stances")
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to fetch stances",
                });
            });
    });
});

describe("mock GET stance with filter", () => {
    test("should return 200 OK with stance filter", () => {
        const fakeStance = [fakeStances[1]];
        db.getStancesFiltered.mockResolvedValue(fakeStance);
        return request(app)
            .get("/stances?StanceID=2")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeStance);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    false,
                    2,
                    null,
                    null,
                );
            });
    });

    test("should return 200 OK with issue filter", () => {
        db.getStancesFiltered.mockResolvedValue(fakeStances);
        return request(app)
            .get("/stances?IssueID=1")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeStances);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    false,
                    null,
                    1,
                    null,
                );
            });
    });

    test("should return 200 OK with empty issue filter", () => {
        db.getStancesFiltered.mockResolvedValue([]);
        return request(app)
            .get("/stances?IssueID=2")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual([]);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    false,
                    null,
                    2,
                    null,
                );
            });
    });

    test("should return 200 OK with party filter", () => {
        const filteredStances = [fakeStances[0]];
        db.getStancesFiltered.mockResolvedValue(filteredStances);
        return request(app)
            .get("/stances?PartyID=1")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(filteredStances);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    false,
                    null,
                    null,
                    1,
                );
            });
    });

    test("should return 200 OK with combined filter", () => {
        const filteredStances = [fakeStances[0]];
        db.getStancesFiltered.mockResolvedValue(filteredStances);
        return request(app)
            .get("/stances?PartyID=1&IssueID=1&StanceID=1")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(filteredStances);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(false, 1, 1, 1);
            });
    });

    test("should return 400 if invalid combined filter", () => {
        return request(app)
            .get("/stances?PartyID=abc&IssueID=2&StanceID=ghi")
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual({ error: "Invalid Arguments" });
            });
    });

    test("should return 400 if invalid filter", () => {
        return request(app)
            .get("/stances?PartyID=dingus")
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual({ error: "Invalid Arguments" });
            });
    });

    test("should return 500 if DB error with filter", () => {
        db.getStancesFiltered.mockRejectedValue(new Error("DB error"));
        return request(app)
            .get("/stances?PartyID=12")
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to fetch stances",
                });
            });
    });
});
