const app = require('../../app');
const request = require('supertest');
jest.mock('../../services/DAL');
const db = require('../../services/DAL');

describe('mock GET quiz question', () => {
    test('should return 200 OK', () => {
        const fakeQuestions = [
            {
                IssueID: 1,
                Description: "Mock Question",
                Summary: "nil"
            }
        ]
        db.getQuestions.mockResolvedValue(fakeQuestions);
        return request(app)
            .get("/questions")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeQuestions);
            });
    });

    test('should return 200 OK and [] for empty set', () => {
        const fakeQuestions = [];
        db.getQuestions.mockResolvedValue(fakeQuestions);
        return request(app)
            .get("/questions")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeQuestions);
            });
    });

    test('should return 500 if DB error', () => {
        db.getQuestions.mockRejectedValue(new Error('DB error'));
        return request(app)
            .get("/questions")
            .then(response => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({ error: 'Failed to fetch questions' });
            });
    });
});
