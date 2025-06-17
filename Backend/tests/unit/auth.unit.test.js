const request = require("supertest");

describe("authorized endpoint without mock", () => {
    let app;
    let request;

    beforeAll(() => {
        jest.resetModules();

        app = require("../../app");
        request = require("supertest");
    });

    test("should return 401 if no credentials", () => {
        return request(app)
            .get("/authorized")
            .then((response) => {
                expect(response.statusCode).toBe(401);
            });
    });
});

describe("mocked auth authorized endpoint", () => {
    let app;
    let request;

    beforeAll(() => {
        jest.resetModules();

        jest.mock("express-oauth2-jwt-bearer", () => ({
            auth: jest.fn(() => (req, res, next) => {
                req.auth = {
                    sub: "user-123",
                    scope: "read:messages",
                };
                next();
            }),
        }));

        app = require("../../app");
        request = require("supertest");
    });

    test("should return 200", () => {
        return request(app)
            .get("/authorized")
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });
});
