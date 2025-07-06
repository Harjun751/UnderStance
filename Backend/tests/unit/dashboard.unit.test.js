jest.mock("express-oauth2-jwt-bearer", () => ({
    auth: jest.fn(() => (req, _res, next) => {
        req.auth = {
            sub: "auth0|user1",
            scope: "read:messages",
        };
        next();
    }),
}));
const middleware = require("../../utils/auth0.middleware");
const db = require("../../utils/DAL");
const app = require("../../app");
const request = require("supertest");

describe("authenticated mock GET dashboard data", () => {
    const dashboardData = {
        "UserID":"auth0|user1",
        "Overall": '{"Bingus":"wingus"}'
    };
    test("should return 200 OK", () => {
        db.getDashboard.mockResolvedValue(dashboardData);
        return request(app)
            .get("/me/dashboard")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(dashboardData);
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
