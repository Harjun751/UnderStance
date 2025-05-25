const app = require('../../app');
const request = require('supertest');
const setupCompose = require('../setup/setupCompose');
const teardownCompose = require('../setup/teardownCompose');
const appPort = 3002;

beforeAll(async () => {
    await setupCompose(3002);
}, 60_000);

afterAll(() => {
    teardownCompose();
});

const fakeStances = [
    {
        StanceID: 1,
        Stand: true,
        Reason: "It's a certified bop",
        IssueID: 1,
        PartyID: 1
    },
    {
        StanceID: 2,
        Stand: true,
        Reason: "The current one is good enough TBH",
        IssueID: 1,
        PartyID: 2
    }
];


describe('GET stances', () => {
    test('200 OK GET all', async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/stances");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(fakeStances);
    });


    test('200 OK GET party filtered', async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/stances?PartyID=2");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([fakeStances[1]]);
    });

    test('200 OK GET IssueID filtered', async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/stances?IssueID=1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(fakeStances);
    });

    test('200 OK GET IssueID empty filtered', async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/stances?IssueID=2");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('200 OK GET StanceID filtered', async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/stances?StanceID=1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(fakeStances);
    });

    test('200 OK GET combined filtered', async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/stances?StanceID=1&PartyID=1&IssueID=1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([fakeStances[0]]);
    });
    
    test('400 Invalid Arguments with bad query params', async () => {
        const response = await request(`http://localhost:${appPort}`)
            .get("/stances?StanceID=1&PartyID=ABCD&IssueID=1");
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid Arguments" });
    });
});

