const app = require("../../app");
const request = require("supertest");
jest.mock("../../services/DAL");
const db = require("../../services/DAL");

const categories = [
    {
        CategoryID: 1,
        Name: "Governance"
    },
    {
        CategoryID: 2
        Name: "Arts"
    },
];

describe("mock GET categories", () => {
    test("should return 200 OK", () => {
        db.getCategories.mockResolvedValue(categories);
        return request(app)
            .get("/categories")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(categories);
            });
    });

    test("should return 500 if DB error", () => {
        db.getCategories.mockRejectedValue(new Error("DB error"));
        return request(app)
            .get("/categories")
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to fetch categories",
                });
            });
    });
});
