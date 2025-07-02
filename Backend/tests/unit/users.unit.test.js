const app = require("../../app");
const request = require("supertest");
jest.mock("../../utils/DAL");
const db = require("../../utils/DAL");

describe("mock GET users", () => {
    test("should return 200 OK", () => {
        return request(app)
            .get("/users")
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });
});
