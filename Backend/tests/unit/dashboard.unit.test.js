jest.mock("express-oauth2-jwt-bearer", () => ({
    auth: jest.fn(() => (req, _res, next) => {
        req.auth = {
            payload: {
                sub: "auth0|user1",
                scope: "read:messages",
            }
        };
        next();
    }),
}));
const _middleware = require("../../utils/auth0.middleware");
jest.mock("../../utils/DAL");
const db = require("../../utils/DAL");
const app = require("../../app");
const request = require("supertest");

describe("authenticated mock GET dashboard data", () => {
    const dashboardData = {
        "UserID":"auth0|user1",
        "Overall": {Bingus:"wingus"},
        "Tabs": {Bingus:"wingus"}
    };
    test("should return 200 OK", () => {
        db.getDashboard.mockResolvedValue(dashboardData);
        return request(app)
            .get("/me/dashboard")
            .then((response) => {
                expect(response.body).toEqual(dashboardData);
                expect(response.statusCode).toBe(200);
                expect(db.getDashboard).toHaveBeenLastCalledWith("auth0|user1");
            });
    });

    test("should return 500 if DB error", () => {
        db.getDashboard.mockRejectedValue(new Error("DB error"));
        return request(app)
            .get("/me/dashboard")
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to fetch dashboard data",
                });
            });
    });
});

describe("authenticated mock PUT dashboard data", () => {
    const dashboardData = {
        UserID:"auth0|user1",
        Overall: {Bingus:"wingus"},
        Tabs: {Bingus:"wingus"}
    };
    test("should return 200 OK if no previous resource", () => {
        db.getDashboard.mockResolvedValue(null);
        db.createDashboard.mockResolvedValue(dashboardData);
        return request(app)
            .put("/me/dashboard")
            .send(dashboardData)
            .then((response) => {
                expect(response.body).toEqual(dashboardData);
                expect(response.statusCode).toBe(200);
                expect(db.getDashboard).toHaveBeenLastCalledWith("auth0|user1");
            });
    });

    test("should return 200 OK if updating resource", () => {
        db.getDashboard.mockResolvedValue(dashboardData);
        db.updateDashboard.mockResolvedValue(dashboardData);
        return request(app)
            .put("/me/dashboard")
            .send(dashboardData)
            .then((response) => {
                expect(response.body).toEqual(dashboardData);
                expect(response.statusCode).toBe(200);
                expect(db.getDashboard).toHaveBeenLastCalledWith("auth0|user1");
            });
    });

    test("should return 400 if invalid JSON", () => {
        const body = { ...dashboardData };
        body.Overall = '{"bingus: wingus"}' //invalid json string
        db.getDashboard.mockResolvedValue(dashboardData);
        db.updateDashboard.mockRejectedValue(new Error("Invalid JSON text"));
        return request(app)
            .put("/me/dashboard")
            .send(body)
            .then((response) => {
                expect(response.body).toMatchObject({ "error": "Invalid Arguments" });
                expect(response.statusCode).toBe(400);
                expect(db.getDashboard).toHaveBeenLastCalledWith("auth0|user1");
            });
    });

    test("should return 400 if missing fields", () => {
        const body = { "UserID": "bingus" };
        return request(app)
            .put("/me/dashboard")
            .send(body)
            .then((response) => {
                expect(response.body).toMatchObject({ "error": "Invalid Arguments" });
                expect(response.statusCode).toBe(400);
            });
    });

    test("should return 500 if DB error", () => {
        db.getDashboard.mockRejectedValue(new Error("DB error"));
        return request(app)
            .put("/me/dashboard")
            .send(dashboardData)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toMatchObject({
                    error: "Failed to update dashboard data",
                });
            });
    });
});
