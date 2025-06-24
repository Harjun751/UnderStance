const request = require("supertest");
const setupCompose = require("../setup/setupCompose");
const teardownCompose = require("../setup/teardownCompose");
const appPort = 3004;

beforeAll(async () => {
    await setupCompose(appPort);
}, 60_000);

afterAll(() => {
    teardownCompose(appPort);
});

describe("GET parties", () => {
    const parties = [
        {
            PartyID: 1,
            Name: "Coalition for Shakira",
            ShortName: "CFS",
            Icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fm%2FnsIzrgTUb6sAAAAC%2Fmonday-left-me-broken-cat.gif&f=1&nofb=1&ipt=037bc199f0a9705f2ffda49a41302c4a674c8d69748df626cd8e70491f1f379d",
            PartyColor: "#FFD700",
        },
        {
            PartyID: 2,
            Name: "Traditionalists' Party",
            ShortName: "TP",
            Icon: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpkbnews.in%2Fwp-content%2Fuploads%2F2023%2F09%2FBlue-Smurf-Cat-Meme.jpg&f=1&nofb=1&ipt=075c2e738b6abfc14555b49cfe8fe2d14433f12cdec84ab46b87516cca95278f",
            PartyColor: "#1E90FF",
        },
    ];

    test("200 OK GET all", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/parties",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(parties);
    });

    test("200 OK GET party filtered id=1", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/parties?ID=1",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([parties[0]]);
    });

    test("200 OK GET party filtered", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/parties?ID=2",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([parties[1]]);
    });

    test("200 OK GET IssueID empty filtered", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/parties?ID=4",
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("400 Invalid Arguments with bad query params", async () => {
        const response = await request(`http://localhost:${appPort}`).get(
            "/parties?ID=abc",
        );
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid Arguments" });
    });
});

describe("GET parties with authentication", () => {
    const parties = [
        {
            PartyID: 1,
            Name: "Coalition for Shakira",
            ShortName: "CFS",
            Icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fm%2FnsIzrgTUb6sAAAAC%2Fmonday-left-me-broken-cat.gif&f=1&nofb=1&ipt=037bc199f0a9705f2ffda49a41302c4a674c8d69748df626cd8e70491f1f379d",
            PartyColor: "#FFD700",
            Active: true,
        },
        {
            PartyID: 2,
            Name: "Traditionalists' Party",
            ShortName: "TP",
            Icon: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpkbnews.in%2Fwp-content%2Fuploads%2F2023%2F09%2FBlue-Smurf-Cat-Meme.jpg&f=1&nofb=1&ipt=075c2e738b6abfc14555b49cfe8fe2d14433f12cdec84ab46b87516cca95278f",
            PartyColor: "#1E90FF",
            Active: true,
        },
        {
            PartyID: 3,
            Name: "Inactive Party",
            ShortName: "IP",
            Icon: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpkbnews.in%2Fwp-content%2Fuploads%2F2023%2F09%2FBlue-Smurf-Cat-Meme.jpg&f=1&nofb=1&ipt=075c2e738b6abfc14555b49cfe8fe2d14433f12cdec84ab46b87516cca95278f",
            PartyColor: "#1E90FF",
            Active: false,
        },
        {
            PartyID: 4,
            Name: "Defunct Party",
            ShortName: "DFP",
            Icon: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpkbnews.in%2Fwp-content%2Fuploads%2F2023%2F09%2FBlue-Smurf-Cat-Meme.jpg&f=1&nofb=1&ipt=075c2e738b6abfc14555b49cfe8fe2d14433f12cdec84ab46b87516cca95278f",
            PartyColor: "#1E90FF",
            Active: false,
        },
    ];

    test("200 OK GET all", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/parties")
            .set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(parties);
    });

    test("200 OK GET party filtered id=1", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/parties?ID=1")
            .set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([parties[0]]);
    });

    test("200 OK GET party filtered", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/parties?ID=2")
            .set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([parties[1]]);
    });

    test("200 OK GET IssueID empty filtered", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/parties?ID=400000")
            .set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("400 Invalid Arguments with bad query params", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/parties?ID=abc")
            .set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid Arguments" });
    });
});

describe("POST party", () => {
    const reqBody = {
        Name: "Integration Test party!",
        ShortName: "IPS",
        Icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
        PartyColor: "#FFFFFF",
        Active: false,
    };

    test("200 OK basic POST", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .post("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(response.statusCode).toBe(200);

        // Check that returned ID exists and is a number
        const insertedID = response.body.PartyID;
        expect(insertedID).not.toBeNaN();
        expect(typeof insertedID).toBe("number");

        // Check that resource exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`)
            .get(`/parties?ID=${insertedID}`)
            .set("authorization", `Bearer ${global.authToken}`);
        expect(getResponse.body).toEqual([
            {
                PartyID: insertedID,
                Name: reqBody.Name,
                ShortName: reqBody.ShortName,
                Icon: reqBody.Icon,
                PartyColor: reqBody.PartyColor,
                Active: reqBody.Active,
            },
        ]);
    });

    test("400 for invalid argument - too long name", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const longName = `
        This is a description > 300 chars long:

        I give you the mausoleum of all hope and desire...I give it to you not that you may remember time, but that you might forget it now and then for a moment and not spend all of your breath trying to conquer it. Because no battle is ever won he said. They are not even fought. The field only reveals to man his own folly and despair, and victory is an illusion of philosophers and fools.`;
        invalidBody.Name = longName;

        const response = await request(`http://localhost:${appPort}`)
            .post("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);

        // Check that resource does not exist
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/parties`,
        );
        expect(getResponse.body.some((obj) => obj.Name === longName)).toBe(
            false,
        );
    });

    test("400 for invalid argument - invalid image url", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const invalidURL = "https://www.wikipedia.org/";
        invalidBody.Icon = invalidURL;

        const response = await request(`http://localhost:${appPort}`)
            .post("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);

        // Check that resource does not exist
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/parties`,
        );
        expect(getResponse.body.some((obj) => obj.Icon === invalidURL)).toBe(
            false,
        );
    });

    test("400 for invalid argument - too long shortname", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const longName = `123456`;
        invalidBody.ShortName = longName;

        const response = await request(`http://localhost:${appPort}`)
            .post("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);

        // Check that resource does not exist
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/parties`,
        );
        expect(getResponse.body.some((obj) => obj.ShortName === longName)).toBe(
            false,
        );
    });

    test("400 for invalid argument - too long url", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const longIconURL = `
        this description is > 2083 chars long 
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;
        invalidBody.Icon = longIconURL;

        const response = await request(`http://localhost:${appPort}`)
            .post("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);

        // Check that resource does not exist
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/parties`,
        );
        expect(getResponse.body.some((obj) => obj.Icon === longIconURL)).toBe(
            false,
        );
    });
});

describe("PUT party", () => {
    const reqBody = {
        PartyID: 1,
        Name: "Integration Test party!",
        ShortName: "IPS",
        Icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
        PartyColor: "#FFFFFF",
        Active: false,
    };

    test("200 OK basic PUT", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .put("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(response.body).toStrictEqual(reqBody);
        expect(response.statusCode).toBe(200);
        // Check that resource exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`)
            .get(`/parties?ID=${reqBody.PartyID}`)
            .set("authorization", `Bearer ${global.authToken}`);
        expect(getResponse.body).toEqual([reqBody]);
    });

    test("400 for invalid argument - too long name", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const longName = `
        This is a description > 300 chars long:

        I give you the mausoleum of all hope and desire...I give it to you not that you may remember time, but that you might forget it now and then for a moment and not spend all of your breath trying to conquer it. Because no battle is ever won he said. They are not even fought. The field only reveals to man his own folly and despair, and victory is an illusion of philosophers and fools.`;
        invalidBody.Name = longName;

        const response = await request(`http://localhost:${appPort}`)
            .put("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);
    });

    test("400 for invalid argument - too long shortname", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const longName = `123456`;
        invalidBody.ShortName = longName;

        const response = await request(`http://localhost:${appPort}`)
            .put("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);
    });

    test("400 for invalid argument - too long url", async () => {
        // create invalid request
        const invalidBody = { ...reqBody };
        const longIconURL = `
        this description is > 2083 chars long 
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;
        invalidBody.Icon = longIconURL;

        const response = await request(`http://localhost:${appPort}`)
            .put("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 400 is returned
        expect(response.statusCode).toBe(400);
    });

    test("404 if resource does not exist", async () => {
        const invalidBody = { ...reqBody };
        invalidBody.PartyID = 200000;

        const response = await request(`http://localhost:${appPort}`)
            .put("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        // Check that 404 is returned
        expect(response.statusCode).toBe(404);
    });
});

describe("DELETE party", () => {
    const reqBody = {
        Name: "I exist to be deleted",
        ShortName: ":(",
        Icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
        PartyColor: "#FFFFF",
        Active: true,
    };

    test("200 OK basic DELETE", async () => {
        // ARRANGE: insert a dummy item to be deleted
        const insert = await request(`http://localhost:${appPort}`)
            .post("/parties")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(insert.statusCode).toBe(200);
        const insertedID = insert.body.PartyID;

        // ACT: delete the resource
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/parties/${insertedID}`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 200
        expect(response.statusCode).toBe(200);
        // ASSERT: Check that resource does exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`)
            .get(`/parties?ID=${insertedID}`)
            .set("authorization", `Bearer ${global.authToken}`);
        expect(getResponse.body).toEqual([]);
    });

    test("404 invalid DELETE for resource that does not exist", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/parties/30000`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 404
        expect(response.statusCode).toBe(404);
    });

    test("400 DELETE for invalid resource identifier", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/parties/dingus`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 200
        expect(response.statusCode).toBe(400);
    });
});
