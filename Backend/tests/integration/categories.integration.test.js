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

describe("GET categories with authentication", () => {
    const categories = [
        {
            CategoryID: 1,
            Name: "National Identity",
        },
    ];

    test("200 OK GET all", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/categories")
            .set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(categories);
    });
});

describe("POST category", () => {
    const reqBody = {
        Name: "Dingus Category",
    };

    test("200 OK basic POST", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .post("/categories")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(response.statusCode).toBe(200);

        // Check that returned ID exists and is a number
        const insertedID = response.body.CategoryID;
        expect(insertedID).not.toBeNaN();
        expect(typeof insertedID).toBe("number");

        // Check that resource exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`)
            .get(`/categories`)
            .set("authorization", `Bearer ${global.authToken}`);
        expect(
            getResponse.body.some(
                (obj) =>
                    obj.CategoryID === insertedID && obj.Name === reqBody.Name,
            ),
        ).toBe(true);
    });

    test("400 for invalid argument - too long name", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const longName = `
        This is a description > 50 chars long:

        I give you the mausoleum of all hope and desire...I give it to you not that you may remember time, but that you might forget it now and then for a moment and not spend all of your breath trying to conquer it. Because no battle is ever won he said. They are not even fought. The field only reveals to man his own folly and despair, and victory is an illusion of philosophers and fools.`;
        invalidBody.Name = longName;

        const response = await request(`http://localhost:${appPort}`)
            .post("/categories")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);

        // Check that resource does not exist
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/categories`,
        );
        expect(getResponse.body.some((obj) => obj.Name === longName)).toBe(
            false,
        );
    });
});

describe("PUT category", () => {
    const reqBody = {
        CategoryID: 1,
        Name: "Dingus2",
    };

    test("200 OK basic PUT", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .put("/categories")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(response.body).toStrictEqual(reqBody);
        expect(response.statusCode).toBe(200);
        // Check that resource exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`)
            .get(`/categories`)
            .set("authorization", `Bearer ${global.authToken}`);
        expect(
            getResponse.body.some(
                (obj) =>
                    obj.CategoryID === reqBody.CategoryID &&
                    obj.Name === reqBody.Name,
            ),
        ).toBe(true);
    });

    test("400 for invalid argument - too long name", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const longName = `
        This is a description > 50 chars long:

        I give you the mausoleum of all hope and desire...I give it to you not that you may remember time, but that you might forget it now and then for a moment and not spend all of your breath trying to conquer it. Because no battle is ever won he said. They are not even fought. The field only reveals to man his own folly and despair, and victory is an illusion of philosophers and fools.`;
        invalidBody.Name = longName;

        const response = await request(`http://localhost:${appPort}`)
            .put("/categories")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);
    });

    test("404 if resource does not exist", async () => {
        const invalidBody = { ...reqBody };
        invalidBody.CategoryID = 200000;

        const response = await request(`http://localhost:${appPort}`)
            .put("/categories")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 404 is returned
        expect(response.statusCode).toBe(404);
    });
});

describe("DELETE category", () => {
    const reqBody = {
        Name: "I exist to be deleted",
    };

    test("200 OK basic DELETE", async () => {
        // ARRANGE: insert a dummy item to be deleted
        const insert = await request(`http://localhost:${appPort}`)
            .post("/categories")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(insert.statusCode).toBe(200);
        const insertedID = insert.body.CategoryID;

        // ACT: delete the resource
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/categories/${insertedID}`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 200
        expect(response.statusCode).toBe(200);
        // ASSERT: Check that resource does not exist in GET call
        const getResponse = await request(`http://localhost:${appPort}`)
            .get(`/categories`)
            .set("authorization", `Bearer ${global.authToken}`);
        expect(
            getResponse.body.some(
                (obj) =>
                    obj.CategoryID === insertedID && obj.Name === reqBody.Name,
            ),
        ).toBe(false);
    });

    test("404 invalid DELETE for resource that does not exist", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/categories/30000`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 404
        expect(response.statusCode).toBe(404);
    });

    test("400 DELETE for invalid resource identifier", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/categories/dingus`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 200
        expect(response.statusCode).toBe(400);
    });

    test("400 DELETE for categories that still have associated questions", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/categories/1`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 200
        expect(response.statusCode).toBe(400);
    });
});
