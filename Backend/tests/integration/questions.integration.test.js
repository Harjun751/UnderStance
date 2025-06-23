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
            "/questions?ID=2000",
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

describe("GET quiz question with authentication", () => {
    test("200 OK basic GET", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/questions",
        ).set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            {
                IssueID: 1,
                Description: "Change national anthem to hip's don't lie",
                Summary: "On the anthem",
                CategoryID: 1,
                Active: true
            },
        ]);
    });

    test("200 OK with filter", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/questions?ID=1",
        ).set("authorization", `Bearer ${global.authToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            {
                IssueID: 1,
                Description: "Change national anthem to hip's don't lie",
                Summary: "On the anthem",
                CategoryID: 1,
                Active: true
            },
        ]);
    });

    test("200 OK with filter with no matching ID", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/questions?ID=2000",
        ).set("authorization", `Bearer ${global.authToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("400 with invalid filter", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/questions?ID=abc",
        ).set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid Arguments" });
    });
});



describe("POST quiz question", () => {
    const reqBody = {
        Description: "Hi from integration test!",
        Summary: "This is a friendly greeting.",
        CategoryID: 1,
        Active: false
    };

    test("200 OK basic POST", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .post("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(response.statusCode).toBe(200);
        
        // Check that returned ID exists and is a number
        let insertedID = response.body.IssueID;
        expect(insertedID).not.toBeNaN();
        expect(typeof insertedID).toBe("number");
        
        // Check that resource exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/questions?ID=${insertedID}`,
        ).set("authorization", `Bearer ${global.authToken}`);
        expect(getResponse.body).toEqual([{
            IssueID: insertedID,
            Description: reqBody.Description,
            Summary: reqBody.Summary,
            CategoryID: reqBody.CategoryID,
            Active: false
        }]);
    });

    test("400 for invalid argument - too long description", async () => {
        // create invalid request
        let invalidBody = { ...reqBody };
        let longDescription  = `
        This is a description > 300 chars long:

        I give you the mausoleum of all hope and desire...I give it to you not that you may remember time, but that you might forget it now and then for a moment and not spend all of your breath trying to conquer it. Because no battle is ever won he said. They are not even fought. The field only reveals to man his own folly and despair, and victory is an illusion of philosophers and fools.`
        invalidBody.Description = longDescription;

        const response = await request(`http://localhost:${appPort}`)
            .post("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);

        // Check that resource does not exist
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/questions`,
        );
        expect(getResponse.body.some(obj => obj.Description === longDescription)).toBe(false);
    });

    test("400 for invalid argument - too long summary", async () => {
        // create invalid request
        let invalidBody = { ...reqBody };
        let longSummary = `
        This is a summary > 50 chars long:
        
        I stay out too late
        Got nothin' in my brain.
        Got nothin' in my brain.
        Got nothin' in my brain.
        `
        invalidBody.Summary = longSummary;

        const response = await request(`http://localhost:${appPort}`)
            .post("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);

        // Check that resource does not exist
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/questions`,
        );
        expect(getResponse.body.some(obj => obj.Summary === longSummary)).toBe(false);
    });

    test("400 for invalid argument - invalid category ID", async () => {
        // create invalid request
        let invalidBody = { ...reqBody };
        invalidBody.CategoryID = 100000;

        const response = await request(`http://localhost:${appPort}`)
            .post("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);

        // Check that resource does not exist
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/questions`,
        );
        expect(getResponse.body.some(obj => obj.CategoryID === 100000)).toBe(false);
    });
});

describe("PUT quiz question", () => {
    const reqBody = {
        IssueID: 1,
        Description: "I changed this description to say what I want.",
        Summary: "This is an unfriendly greeting.",
        CategoryID: 1,
        Active: false
    };

    test("200 OK basic PUT", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .put("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);

        // Check that response is 200 and body matches exactly
        /*expect(response.statusCode).toBe(200);*/
        expect(response.body).toStrictEqual(reqBody);
        
        // Check that resource exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/questions?ID=${reqBody.IssueID}`,
        ).set("authorization", `Bearer ${global.authToken}`);
        expect(getResponse.body).toEqual([reqBody]);
    });

    test("400 for invalid argument - too long description", async () => {
        // create invalid request
        let invalidBody = { ...reqBody };
        let longDescription  = `
        This is a description > 300 chars long:

        I give you the mausoleum of all hope and desire...I give it to you not that you may remember time, but that you might forget it now and then for a moment and not spend all of your breath trying to conquer it. Because no battle is ever won he said. They are not even fought. The field only reveals to man his own folly and despair, and victory is an illusion of philosophers and fools.`
        invalidBody.Description = longDescription;

        const response = await request(`http://localhost:${appPort}`)
            .put("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);
    });

    test("400 for invalid argument - too long summary", async () => {
        // create invalid request
        let invalidBody = { ...reqBody };
        let longSummary = `
        This is a summary > 50 chars long:
        
        I stay out too late
        Got nothin' in my brain.
        Got nothin' in my brain.
        Got nothin' in my brain.
        `
        invalidBody.Summary = longSummary;

        const response = await request(`http://localhost:${appPort}`)
            .put("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);
    });

    test("400 for invalid argument - invalid categoryID", async () => {
        // create invalid request
        let invalidBody = { ...reqBody };
        invalidBody.CategoryID = 13000;

        const response = await request(`http://localhost:${appPort}`)
            .put("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);
    });

    test("404 if resource does not exist", async () => {
        let invalidBody =  { ...reqBody };
        invalidBody.IssueID = 200000;

        const response = await request(`http://localhost:${appPort}`)
            .put("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 404 is returned
        expect(response.statusCode).toBe(404);
    });

});

describe("DELETE quiz question", () => {
    const reqBody = {
        Description: "I exist to be deleted",
        Summary: "My existence temporary",
        CategoryID: 1,
        Active: true
    };

    test("200 OK basic DELETE", async () => {
        // ARRANGE: insert a dummy item to be deleted
        let insert = await request(`http://localhost:${appPort}`)
            .post("/questions")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        let insertedID = insert.body.IssueID;

        // ACT: delete the resource
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/questions/${insertedID}`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 200
        expect(response.statusCode).toBe(200);
        // ASSERT: Check that resource does exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/questions?ID=${insertedID}`,
        ).set("authorization", `Bearer ${global.authToken}`);
        expect(getResponse.body).toEqual([]);
    });

    test("404 invalid DELETE for resource that does not exist", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/questions/30000`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 404
        expect(response.statusCode).toBe(404);
    });

    test("400 DELETE for invalid resource identifier", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/questions/dingus`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 200
        expect(response.statusCode).toBe(400);
    });
});

