const app = require('../../app');
const request = require('supertest');
const setupCompose = require('../setup/setupCompose');
const teardownCompose = require('../setup/teardownCompose');

beforeAll(async () => {
    await setupCompose();
}, 60_000);

afterAll(() => {
    teardownCompose();
});

describe('GET quiz question', () => {
    test('should return 200 OK', async () => {
        const response = await request("http://localhost:3001")
            .get("/questions");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{
            IssueID: 1,
            Description: "Change national anthem to hip's don't lie",
            Summary: "On the anthem"
        }]);
    });
});
