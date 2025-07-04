jest.mock("express-oauth2-jwt-bearer", () => ({
    auth: jest.fn(() => (req, _res, next) => {
        req.auth = {
            sub: "user-123",
            scope: "read:messages",
        };
        next();
    }),
}));
const middleware = require("../../utils/auth0.middleware");
jest.spyOn(middleware, "checkRequiredPermissions").mockImplementation(
    (_requiredPermissions) => {
        return (_req, _res, next) => {
            next();
        };
    },
);
const realFetch = global.fetch;
const fakeFetch = jest.fn();
global.fetch = jest.fn((url, options) => {
    if (url.includes("auth0.com")) {
        return realFetch(url, options);
    } else {
        return fakeFetch(url, options);
    }
});
fakeFetch.mockResolvedValue({
    ok: true,
    headers: {
        get: (header) => (header === "content-type" ? "image/png" : null),
    },
});

const fakeUsers = [
    {
        email: "hi@fake.com",
        nickname: "test",
        picture: "https://www.com",
        user_id: "123",
    },
    {
        email: "hi@2fake.com",
        nickname: "test2",
        picture: "https://www.com",
        user_id: "1234",
    },
];
const fakeRoles = [{ name: "admin" }, { name: "editor" }, { name: "viewer" }];

const mockGetAll = jest
    .fn()
    .mockImplementation(() => Promise.resolve({ data: fakeUsers }));
const mockGetRoles = jest.fn().mockImplementation(({ id }) => {
    if (id === "123") {
        return Promise.resolve({
            data: [{ name: "admin" }],
        });
    } else if (id === "1234") {
        return Promise.resolve({
            data: [{ name: "editor" }, { name: "viewer" }],
        });
    } else {
        return Promise.resolve({
            data: [],
        });
    }
});
const mockCreate = jest.fn().mockResolvedValue({ data: { user_id: 12 } });

const mockGetAllRoles = jest
    .fn()
    .mockImplementation(() => Promise.resolve({ data: fakeRoles }));
const mockUpdateUser = jest.fn().mockImplementation(() => {
    Promise.resolve({ data: { user_id: 12 } });
});
const mockDeleteUser = jest.fn();
jest.mock("auth0", () => ({
    ManagementClient: jest.fn().mockImplementation(() => ({
        users: {
            getAll: mockGetAll,
            getRoles: mockGetRoles,
            create: mockCreate,
            assignRoles: jest.fn(),
            update: mockUpdateUser,
            delete: mockDeleteUser,
        },
        roles: {
            getAll: mockGetAllRoles,
        },
    })),
}));

const app = require("../../app");
const request = require("supertest");

describe("mock GET users", () => {
    test("should return 200 OK", () => {
        const expected = fakeUsers.map((user) => ({ ...user }));
        expected[0].roles = "admin";
        expected[1].roles = "editor, viewer";
        return request(app)
            .get("/users")
            .then((response) => {
                expect(response.body).toEqual(expected);
                expect(response.statusCode).toBe(200);
            });
    });
    test("should return 500 if management API error", () => {
        mockGetAll.mockRejectedValue(new Error("API Error"));
        return request(app)
            .get("/users")
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
});

describe("mock POST user", () => {
    const fakeUser = {
        Name: "Test",
        Email: "test@gmail.com",
        Role: "admin",
        Picture: "url.com",
    };

    test("should return 200 OK", () => {
        return request(app)
            .post("/users")
            .send(fakeUser)
            .then((response) => {
                expect(response.body).toEqual({ user_id: 12 });
                expect(response.statusCode).toBe(200);
            });
    });

    test("should return 400 for missing arguments", () => {
        const respBody = { Name: fakeUser.Name };
        return request(app)
            .post("/users")
            .send(respBody)
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toMatchObject({
                    error: "Invalid Arguments",
                });
            });
    });

    test("should return 500 if management API error", () => {
        mockCreate.mockRejectedValue(new Error("API Error"));
        return request(app)
            .post("/users")
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
});

describe("mock PATCH user", () => {
    const fakeUser = {
        ID: "sub|123",
        Name: "Test",
        Email: "test@gmail.com",
        Picture: "url.com",
        Role: "admin",
    };

    test("should return 200 OK", () => {
        return request(app)
            .patch("/users")
            .send(fakeUser)
            .then((response) => {
                expect(response.body).toEqual({ user_id: "sub|123" });
                expect(response.statusCode).toBe(200);
            });
    });

    test("should return 200 with some arguments", () => {
        const respBody = { ID: fakeUser.ID, Name: fakeUser.Name };
        return request(app)
            .patch("/users")
            .send(respBody)
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });

    test("should return 200 with some arguments", () => {
        const respBody = { ID: fakeUser.ID, Picture: fakeUser.Picture };
        return request(app)
            .patch("/users")
            .send(respBody)
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });

    test("should return 400 with no ID supplied", () => {
        const respBody = { Picture: fakeUser.Picture };
        return request(app)
            .patch("/users")
            .send(respBody)
            .then((response) => {
                expect(response.statusCode).toBe(400);
            });
    });

    test("should return 500 if management API error", () => {
        mockUpdateUser.mockRejectedValue(new Error("API Error"));
        return request(app)
            .patch("/users")
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
});

describe("mock DELETE users", () => {
    test("should return 200 OK", () => {
        return request(app)
            .delete("/users/sub123")
            .then((response) => {
                expect(response.body).toEqual({
                    message: "Successfully deleted",
                });
                expect(response.statusCode).toBe(200);
            });
    });

    test("should return 500 if DB error", () => {
        mockDeleteUser.mockRejectedValue(new Error("API error"));
        return request(app)
            .delete("/users/1")
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to delete user",
                });
            });
    });
});

describe("mock GET roles", () => {
    test("should return 200 OK", () => {
        const expected = fakeRoles;
        return request(app)
            .get("/roles")
            .then((response) => {
                expect(response.body).toEqual(fakeRoles);
                expect(response.statusCode).toBe(200);
            });
    });

    test("should return 500 if management API error", () => {
        mockGetAllRoles.mockRejectedValue(new Error("API Error"));
        return request(app)
            .get("/roles")
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
    });
});
