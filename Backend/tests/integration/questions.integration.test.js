const request = require("supertest");
const setupCompose = require("../setup/setupCompose");
const teardownCompose = require("../setup/teardownCompose");
const appPort = 3002;

beforeAll(async () => {
    await setupCompose(appPort);
}, 60_000);

afterAll(() => {
    teardownCompose(appPort);
});

describe("GET quiz question", () => {
    test("200 OK basic GET", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/questions",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            {
                IssueID: 1,
                Description: "Change national anthem to hip's don't lie",
                Summary: "On the anthem",
                Category: "National Identity",
            },
        ]);
    });

    test("200 OK with filter", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/questions?ID=1",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            {
                IssueID: 1,
                Description: "Change national anthem to hip's don't lie",
                Summary: "On the anthem",
                Category: "National Identity",
            },
        ]);
    });

    test("200 OK with filter with no matching ID", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/questions?ID=9",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("400 with invalid filter", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/questions?ID=abc",
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid Arguments" });
    });
});
