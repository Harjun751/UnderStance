const app = require("../../app");
const request = require("supertest");

describe("CORS headers", () => {
    test("sets correct header on valid admin FE origin", async () => {
        const res = await request(app)
            .get("/")
            .set("Origin", "http://localhost:5173");

        expect(res.headers["access-control-allow-origin"]).toBe(
            "http://localhost:5173",
        );
    });

    test("sets correct header on valid FE origin", async () => {
        const res = await request(app)
            .get("/")
            .set("Origin", "http://localhost:5174");

        expect(res.headers["access-control-allow-origin"]).toBe(
            "http://localhost:5174",
        );
    });

    test("does not set header if invalid origin", async () => {
        const res = await request(app)
            .get("/")
            .set("Origin", "http://malicious-site.com");

        expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    });
});
