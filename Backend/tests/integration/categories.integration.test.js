const request = require("supertest");
const setupCompose = require("../setup/setupCompose");
const teardownCompose = require("../setup/teardownCompose");
const appPort = 3005;

beforeAll(async () => {
    await setupCompose(appPort);
}, 60_000);

afterAll(() => {
    teardownCompose(appPort);
});

describe("GET categories", () => {
    const categories = [
        {
            CategoryID: 1,
            Name: "National Identity",
        },
    ];

    test("200 OK GET all", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/categories",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(categories);
    });
});

