const request = require("supertest");
const setupCompose = require("../setup/setupCompose");
const teardownCompose = require("../setup/teardownCompose");
const appPort = 3003;

beforeAll(async () => {
    await setupCompose(appPort);
}, 60_000);

afterAll(() => {
    teardownCompose(appPort);
});

const fakeStances = [
    {
        StanceID: 1,
        Stand: true,
        Reason: "It's a certified bop",
        IssueID: 1,
        PartyID: 1,
    },
    {
        StanceID: 2,
        Stand: false,
        Reason: "The current one is good enough TBH",
        IssueID: 1,
        PartyID: 2,
    },
];

describe("authenticated GET stances", () => {
    // deep copy the above-defined response
    const extendedFakeStances = JSON.parse(JSON.stringify(fakeStances));
    // verify that inactive parties show up in the response too
    extendedFakeStances[0]["Issue Summary"] = "On the anthem";
    extendedFakeStances[1]["Issue Summary"] = "On the anthem";
    extendedFakeStances[0].Party = "Coalition for Shakira";
    extendedFakeStances[1].Party = "Traditionalists' Party";
    extendedFakeStances.push({
        StanceID: 3,
        Stand: false,
        Reason: "Our opinions are irrelevant",
        IssueID: 1,
        PartyID: 3,
        "Issue Summary": "On the anthem",
        Party: "Inactive Party",
    });

    test("200 OK GET all", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/stances")
            .set("authorization", `Bearer ${global.authToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(extendedFakeStances);
    });
});

describe("POST stance", () => {
    const reqBody = {
        Stand: false,
        Reason: "Defunct Party's stance: we don't know.",
        IssueID: 1,
        PartyID: 4,
    };

    test("200 OK basic POST", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .post("/stances")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(response.statusCode).toBe(200);

        // Check that returned ID exists and is a number
        const insertedID = response.body.StanceID;
        expect(insertedID).not.toBeNaN();
        expect(typeof insertedID).toBe("number");

        // Check that resource exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`)
            .get(`/stances?StanceID=${insertedID}`)
            .set("authorization", `Bearer ${global.authToken}`);
        expect(getResponse.body).toEqual([
            {
                StanceID: insertedID,
                Stand: reqBody.Stand,
                Reason: reqBody.Reason,
                IssueID: reqBody.IssueID,
                PartyID: reqBody.PartyID,
                "Issue Summary": "On the anthem",
                Party: "Defunct Party",
            },
        ]);
    });

    test("400 for invalid argument - too long reason", async () => {
        const invalidBody = { ...reqBody };
        const longReason = `
        This decription is longer than 1000 characters.
        According to all known lawsof aviation,there is no way a beeshould be able to fly.Its wings are too small to getits fat little body off the ground.The bee, of course, flies anywaybecause bees don't carewhat humans think is impossible.Yellow, black. Yellow, black.Yellow, black. Yellow, black.Ooh, black and yellow!Let's shake it up a little.Barry! Breakfast is ready!Coming!Hang on a second.Hello?- Barry?- Adam?- Can you believe this is happening?- I can't. I'll pick you up.Looking sharp.Use the stairs. Your fatherpaid good money for those.Sorry. I'm excited.Here's the graduate.We're very proud of you, son.A perfect report card, all B's.Very proud.Ma! I got a thing going here.- You got lint on your fuzz.- Ow! That's me!- Wave to us! We'll be in row 118,000.- Bye!Barry, I told you,stop flying in the house!- Hey, Adam.- Hey, Barry.- Is that fuzz gel?- A little. Special day, graduation.Never thought I'd make it.Three days grade school,three days high school.Those were awkward.Three days college. I'm glad I tooka day and hitchhiked around the hive.
        `;
        invalidBody.Reason = longReason;

        const response = await request(`http://localhost:${appPort}`)
            .post("/stances")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        expect(response.statusCode).toBe(400);
    });

    test("400 for duplicate stances", async () => {
        const invalidBody = { ...reqBody };
        invalidBody.PartyID = 1;
        const response = await request(`http://localhost:${appPort}`)
            .post("/stances")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        expect(response.statusCode).toBe(400);
    });

    test("403 for token with invalid scope", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .post("/stances")
            .set("authorization", `Bearer ${global.unprivilegedAuthToken}`)
            .send(reqBody);
        // Check that 403 is returned
        expect(response.statusCode).toBe(403);
    });
});

describe("PUT stance", () => {
    const reqBody = {
        StanceID: 1,
        Stand: false,
        Reason: "Changed my view.",
        IssueID: 1,
        PartyID: 1,
    };

    test("200 OK basic PUT", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .put("/stances")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(reqBody);
        expect(response.body).toStrictEqual(reqBody);
        expect(response.statusCode).toBe(200);

        // Check that resource exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`).get(
            `/stances?StanceID=${reqBody.StanceID}`,
        );
        expect(getResponse.body).toEqual([reqBody]);
    });

    test("400 for invalid argument - too long reason", async () => {
        const invalidBody = { ...reqBody };
        const longReason = `
        This decription is longer than 1000 characters.
        According to all known lawsof aviation,there is no way a beeshould be able to fly.Its wings are too small to getits fat little body off the ground.The bee, of course, flies anywaybecause bees don't carewhat humans think is impossible.Yellow, black. Yellow, black.Yellow, black. Yellow, black.Ooh, black and yellow!Let's shake it up a little.Barry! Breakfast is ready!Coming!Hang on a second.Hello?- Barry?- Adam?- Can you believe this is happening?- I can't. I'll pick you up.Looking sharp.Use the stairs. Your fatherpaid good money for those.Sorry. I'm excited.Here's the graduate.We're very proud of you, son.A perfect report card, all B's.Very proud.Ma! I got a thing going here.- You got lint on your fuzz.- Ow! That's me!- Wave to us! We'll be in row 118,000.- Bye!Barry, I told you,stop flying in the house!- Hey, Adam.- Hey, Barry.- Is that fuzz gel?- A little. Special day, graduation.Never thought I'd make it.Three days grade school,three days high school.Those were awkward.Three days college. I'm glad I tooka day and hitchhiked around the hive.
        `;
        invalidBody.Reason = longReason;
        const response = await request(`http://localhost:${appPort}`)
            .put("/stances")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        expect(response.statusCode).toBe(400);
    });

    test("400 for duplicate stances", async () => {
        const invalidBody = { ...reqBody };
        invalidBody.PartyID = 2;
        const response = await request(`http://localhost:${appPort}`)
            .post("/stances")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        expect(response.statusCode).toBe(400);
    });

    test("404 if does not exist", async () => {
        const invalidBody = { ...reqBody };
        invalidBody.StanceID = 2000000;
        const response = await request(`http://localhost:${appPort}`)
            .put("/stances")
            .set("authorization", `Bearer ${global.authToken}`)
            .send(invalidBody);
        expect(response.statusCode).toBe(404);
    });

    test("403 for token with invalid scope", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .put("/stances")
            .set("authorization", `Bearer ${global.unprivilegedAuthToken}`)
            .send(reqBody);
        // Check that 403 is returned
        expect(response.statusCode).toBe(403);
    });
});

describe("DELETE stance", () => {
    const toBeDeleted = {
        StanceID: 2,
        Stand: false,
        Reason: "The current one is good enough TBH",
        IssueID: 1,
        PartyID: 2,
    };

    test("200 OK basic DELETE", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/stances/${toBeDeleted.StanceID}`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 200
        expect(response.statusCode).toBe(200);
        // ASSERT: Check that resource does exists in GET call
        const getResponse = await request(`http://localhost:${appPort}`)
            .get(`/stances?StanceID=${toBeDeleted.StanceID}`)
            .set("authorization", `Bearer ${global.authToken}`);
        expect(getResponse.body).toEqual([]);
    });

    test("404 invalid DELETE for resource that does not exist", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/stances/30000`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 404
        expect(response.statusCode).toBe(404);
    });

    test("400 DELETE for invalid resource identifier", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete(`/stances/dingus`)
            .set("authorization", `Bearer ${global.authToken}`);

        // ASSERT: check that response was 400
        expect(response.statusCode).toBe(400);
    });

    test("403 for token with invalid scope", async () => {
        const response = await request(`http://localhost:${appPort}`)
            .delete("/stances/1")
            .set("authorization", `Bearer ${global.unprivilegedAuthToken}`);
        // Check that 403 is returned
        expect(response.statusCode).toBe(403);
    });
});
