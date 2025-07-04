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

const app = require("../../app");
const request = require("supertest");
jest.mock("../../utils/DAL");
const db = require("../../utils/DAL");

const fakeStances = [
    {
        StanceID: 1,
        Stand: true,
        Reason: "Who can argue against such a banger",
        IssueID: 1,
        PartyID: 1,
    },
    {
        StanceID: 2,
        Stand: false,
        Reason: "I think our national anthem is perfectly fine",
        IssueID: 1,
        PartyID: 2,
    },
];

describe("mock GET stances", () => {
    test("should return 200 OK", () => {
        db.getStances.mockResolvedValue(fakeStances);
        return request(app)
            .get("/stances")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeStances);
                expect(db.getStances).toHaveBeenLastCalledWith(true);
            });
    });

    test("should return 500 if DB error", () => {
        db.getStances.mockRejectedValue(new Error("DB error"));
        return request(app)
            .get("/stances")
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(db.getStances).toHaveBeenLastCalledWith(true);
                expect(response.body).toEqual({
                    error: "Failed to fetch stances",
                });
            });
    });
});

describe("mock GET stance with filter", () => {
    test("should return 200 OK with stance filter", () => {
        const fakeStance = [fakeStances[1]];
        db.getStancesFiltered.mockResolvedValue(fakeStance);
        return request(app)
            .get("/stances?StanceID=2")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeStance);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    true,
                    2,
                    null,
                    null,
                );
            });
    });

    test("should return 200 OK with issue filter", () => {
        db.getStancesFiltered.mockResolvedValue(fakeStances);
        return request(app)
            .get("/stances?IssueID=1")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeStances);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    true,
                    null,
                    1,
                    null,
                );
            });
    });

    test("should return 200 OK with empty issue filter", () => {
        db.getStancesFiltered.mockResolvedValue([]);
        return request(app)
            .get("/stances?IssueID=2")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual([]);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    true,
                    null,
                    2,
                    null,
                );
            });
    });

    test("should return 200 OK with party filter", () => {
        const filteredStances = [fakeStances[0]];
        db.getStancesFiltered.mockResolvedValue(filteredStances);
        return request(app)
            .get("/stances?PartyID=1")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(filteredStances);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    true,
                    null,
                    null,
                    1,
                );
            });
    });

    test("should return 200 OK with combined filter", () => {
        const filteredStances = [fakeStances[0]];
        db.getStancesFiltered.mockResolvedValue(filteredStances);
        return request(app)
            .get("/stances?PartyID=1&IssueID=1&StanceID=1")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(filteredStances);
                expect(db.getStancesFiltered).toHaveBeenCalledWith(
                    true,
                    1,
                    1,
                    1,
                );
            });
    });
});

describe("authenticated mock POST stance", () => {
    const fakeStance = {
        Stand: true,
        Reason: "Who can argue against such a banger",
        IssueID: 1,
        PartyID: 1,
    };

    test("should return 200 OK", () => {
        db.insertStance.mockResolvedValue(12);
        return request(app)
            .post("/stances")
            .send(fakeStance)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.StanceID).toEqual(12);
                expect(db.insertStance).toHaveBeenLastCalledWith(
                    fakeStance.Stand,
                    fakeStance.Reason,
                    fakeStance.IssueID,
                    fakeStance.PartyID,
                );
            });
    });

    test("should return 400 if multiple stances for same party on same issue", () => {
        db.insertStance.mockRejectedValue(
            new Error("Unique Constraint Violation"),
        );
        return request(app)
            .post("/stances")
            .send(fakeStance)
            .then((response) => {
                expect(response.body).toEqual({
                    error: "Invalid Arguments",
                    details: "Party cannot have 2 stances on the same issue.",
                });
                expect(response.statusCode).toBe(400);
            });
    });

    test("should return 400 if missing arguments", () => {
        return request(app)
            .post("/stances")
            .send({
                Name: fakeStance.Stand,
            })
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toMatchObject({
                    error: "Invalid Arguments",
                });
            });
    });

    test("should return 400 if invalid argument", () => {
        const fakeCopy = { ...fakeStance };
        fakeCopy.Reason = `
        This is a reason > 1000 characters long

            The only thing known to go faster than ordinary light is monarchy, according to the philosopher Ly Tin Wheedle. He reasoned like this: you can't have more than one king, and tradition demands that there is no gap between kings, so when a king dies the succession must therefore pass to the heir instantaneously. Presumably, he said, there must be some elementary particles -- kingons, or possibly queons -- that do this job, but of course succession sometimes fails if, in mid-flight, they strike an anti-particle, or republicon. His ambitious plans to use his discovery to send messages, involving the careful torturing of a small king in order to modulate the signal, were never fully expanded because, at that point, the bar closed.

            Need more characters.alsdkfjlaksdfklasldflaslflaslfaslflkasdlflasdlfsadlflsdlfsljdkflsldfsaasdfasdfasdfasdfkhasdfjaskldfjklasljdfljkalvnkjvckjxzhcvjkhzxlkvjzxklvjlkzxvkjlljkljkljksdafjlklaskjdfkljaskljdfljkasdlkjflkjasdlkjfljkasdfljkasljkdfasdflkasdljfkdalsfjlksadjlkflsdlkjflslslsdlkjfsladfASDFSAFSADFSDFASDFSADFD
        `;
        return request(app)
            .post("/stances")
            .send(fakeCopy)
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toMatchObject({
                    error: "Invalid Arguments",
                });
            });
    });

    test("should return 500 if DB error", () => {
        db.insertStance.mockRejectedValue(new Error("DB error"));
        return request(app)
            .post("/stances")
            .send(fakeStance)
            .then((response) => {
                expect(response.body).toEqual({
                    error: "Failed to insert stance",
                });
                expect(response.statusCode).toBe(500);
                expect(db.insertStance).toHaveBeenLastCalledWith(
                    fakeStance.Stand,
                    fakeStance.Reason,
                    fakeStance.IssueID,
                    fakeStance.PartyID,
                );
            });
    });
});

describe("authenticated mock PUT party", () => {
    const fakeStance = {
        StanceID: 1,
        Stand: true,
        Reason: "Who can argue against such a banger",
        IssueID: 1,
        PartyID: 1,
    };

    test("should return 200 OK", () => {
        db.updateStance.mockResolvedValueOnce(fakeStance);
        return request(app)
            .put("/stances")
            .send(fakeStance)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeStance);
                expect(db.updateStance).toHaveBeenLastCalledWith(
                    fakeStance.StanceID,
                    fakeStance.Stand,
                    fakeStance.Reason,
                    fakeStance.IssueID,
                    fakeStance.PartyID,
                );
            });
    });

    test("should return 404 for missing ID", () => {
        db.updateStance.mockRejectedValue(new Error("Invalid Resource"));
        return request(app)
            .put("/stances")
            .send(fakeStance)
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toEqual({
                    error: "Could not update stance with requested ID",
                });
            });
    });

    test("should return 400 for unique contraint violation", () => {
        db.updateStance.mockRejectedValue(
            new Error("Unique Constraint Violation"),
        );
        return request(app)
            .put("/stances")
            .send(fakeStance)
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual({
                    error: "Invalid Arguments",
                    details: "Each party should only have 1 stance per issue.",
                });
            });
    });

    test("should return 400 if missing arguments", () => {
        return request(app)
            .put("/stances")
            .send({
                Name: fakeStance.Stand,
            })
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toMatchObject({
                    error: "Invalid Arguments",
                });
            });
    });

    test("should return 400 if invalid argument", () => {
        const fakeCopy = { ...fakeStance };
        fakeCopy.Reason = `
        This is a reason > 1000 characters long

            The only thing known to go faster than ordinary light is monarchy, according to the philosopher Ly Tin Wheedle. He reasoned like this: you can't have more than one king, and tradition demands that there is no gap between kings, so when a king dies the succession must therefore pass to the heir instantaneously. Presumably, he said, there must be some elementary particles -- kingons, or possibly queons -- that do this job, but of course succession sometimes fails if, in mid-flight, they strike an anti-particle, or republicon. His ambitious plans to use his discovery to send messages, involving the careful torturing of a small king in order to modulate the signal, were never fully expanded because, at that point, the bar closed.

            Need more characters.alsdkfjlaksdfklasldflaslflaslfaslflkasdlflasdlfsadlflsdlfsljdkflsldfsaasdfasdfasdfasdfkhasdfjaskldfjklasljdfljkalvnkjvckjxzhcvjkhzxlkvjzxklvjlkzxvkjlljkljkljksdafjlklaskjdfkljaskljdfljkasdlkjflkjasdlkjfljkasdfljkasljkdfasdflkasdljfkdalsfjlksadjlkflsdlkjflslslsdlkjfsladfASDFSAFSADFSDFASDFSADFD
        `;
        return request(app)
            .put("/stances")
            .send(fakeCopy)
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toMatchObject({
                    error: "Invalid Arguments",
                });
            });
    });

    test("should return 500 if DB error", () => {
        db.updateStance.mockRejectedValue(new Error("DB error"));
        return request(app)
            .put("/stances")
            .send(fakeStance)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to update stance",
                });
            });
    });
});

describe("authenticated mock DELETE stance", () => {
    test("should return 200 OK", () => {
        db.deleteStance.mockResolvedValue({ rowCount: 1 });
        return request(app)
            .delete("/stances/1")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({
                    message: "Successfully deleted",
                });
                expect(db.deleteStance).toHaveBeenLastCalledWith(1);
            });
    });

    test("should return 400 if invalid param", () => {
        db.deleteStance.mockResolvedValue({ rowCount: 0 });
        return request(app)
            .delete("/stances/dingus")
            .then((response) => {
                expect(response.statusCode).toBe(400);
            });
    });

    test("should return 404 if no valid resource", () => {
        db.deleteStance.mockRejectedValue(new Error("Invalid Resource"));
        return request(app)
            .delete("/stances/13000")
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(db.deleteStance).toHaveBeenLastCalledWith(13000);
            });
    });

    test("should return 500 if DB error", () => {
        db.deleteStance.mockRejectedValueOnce(new Error("DB error"));
        return request(app)
            .delete("/stances/1")
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to delete stance",
                });
                expect(db.deleteStance).toHaveBeenLastCalledWith(1);
            });
    });
});
