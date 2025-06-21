jest.mock("express-oauth2-jwt-bearer", () => ({
    auth: jest.fn(() => (req, res, next) => {
        req.auth = {
            sub: "user-123",
            scope: "read:messages",
        };
        next();
    }),
}));
const app = require("../../app");
const request = require("supertest");
jest.mock("../../services/DAL");
const db = require("../../services/DAL");

describe("authenticated mock GET quiz question", () => {
    test("should return 200 OK", () => {
        const fakeQuestions = [
            {
                IssueID: 1,
                Description: "Mock Question",
                Summary: "nil",
                Active: true
            },
        ];
        db.getQuestions.mockResolvedValue(fakeQuestions);
        return request(app)
            .get("/questions")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeQuestions);
                expect(db.getQuestions).toHaveBeenCalledWith(true);
            });
    });

    test("should return 200 OK with filter", () => {
        const fakeQuestions = [
            {
                IssueID: 1,
                Description: "Mock Question",
                Summary: "nil",
                Active: true
            },
        ];
        db.getQuestionWithID.mockResolvedValue(fakeQuestions);
        return request(app)
            .get("/questions?ID=1")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakeQuestions);
                expect(db.getQuestionWithID).toHaveBeenCalledWith(true, 1);
            });
    });
});




// represents ID of just-inserted object
const insertReturnValue = 12;
const fakeDescription = "Fake description"
const fakeSummary = "Fake Summary"
const fakeCategory = "Fake Category"
const fakeActive = false;
const fakeBody = 
    {
        Description: fakeDescription,
        Summary: fakeSummary,
        Category: fakeCategory,
        Active: fakeActive
    };

describe("authenticated mock POST quiz question", () => {
    test("should return 200 OK", () => {
        db.insertQuestion.mockResolvedValue(12);
        return request(app)
            .post("/questions")
            .send(fakeBody)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.IssueID).toEqual(12);
                expect(db.insertQuestion).toHaveBeenLastCalledWith(
                    fakeDescription, fakeSummary, fakeCategory, fakeActive
                );
            });
    });

    test("should return 400 if invalid argument", () => {
        return request(app)
            .post("/questions")
            .send({
                Description: `
                    This is a description so long that it exceeds the 300 character limit.

                    Once there were brook trout in the streams in the mountains. You could see them standing in the amber current where the white edges of their fins wimpled softly in the flow. They smelled of moss in your hand. Polished and muscular and torsional. On their backs were vermiculate patterns that were maps of the world in its becoming. Maps and mazes. Of a thing which could not be put back. Not be made right again. In the deep glens where they lived all things were older than man and they hummed of mystery.
                `,
                Summary: fakeSummary,
                Category: fakeCategory
            })
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual({ error: "Invalid Arguments" });
            });
    });

    test("should return 500 if DB error", () => {
        db.insertQuestion.mockRejectedValue(new Error("DB error"));
        return request(app)
            .post("/questions")
            .send(fakeBody)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to insert question",
                });
                expect(db.insertQuestion).toHaveBeenLastCalledWith(
                    fakeDescription, fakeSummary, fakeCategory, fakeActive
                );
            });
    });
});

const fakeIssueID = 12;
const fakePutBody = {
    IssueID: fakeIssueID,
    Description: fakeDescription,
    Summary: fakeSummary,
    Category: fakeCategory,
    Active: fakeActive
}

describe("authenticated mock PUT quiz question", () => {
    test("should return 200 OK", () => {
        db.updateQuestion.mockResolvedValue(fakePutBody);
        return request(app)
            .put("/questions")
            .send(fakePutBody)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(fakePutBody);
                expect(db.updateQuestion).toHaveBeenLastCalledWith(
                    fakeIssueID, fakeDescription, fakeSummary, fakeCategory, fakeActive
                );
            });
    });

    test("should return 400 if invalid argument", () => {
        return request(app)
            .put("/questions")
            .send({
                IssueID: fakeIssueID,
                Description: fakeDescription,
                Summary: `
                    This is another description too long.

                    Dingle bingle went to the wingle shingle down at ringle road. There at the shingle, loud jingles were being played.tingle bingle, dingle bingle's sibling, shingled his hingles a little too fingley. Dingle bingle and tingle bingle were forced to leave the wingle shingle down at ringle road. Dismayed, both dingle and tingle head back home, single, to gingle fingle where their mom, mingle bingle cooked them a nice ningle lingle.

                `,
                Category: fakeCategory,
                Active: fakeActive
            })
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual({ error: "Invalid Arguments" });
            });
    });

    test("shold return 404 if resource to be updated doesn't exist", () => {
        db.updateQuestion.mockRejectedValue(new Error("Invalid Resource"));
        return request(app)
            .put("/questions")
            .send(fakePutBody)
            .then(response => {
                expect(response.statusCode).toBe(404)
                expect(response.body).toEqual({
                    error: "Could not update Issue with requested ID"
                });
                expect(db.updateQuestion).toHaveBeenLastCalledWith(
                    fakeIssueID, fakeDescription, fakeSummary, fakeCategory, fakeActive
                );
            });
    });

    test("should return 500 if DB error", () => {
        db.updateQuestion.mockRejectedValue(new Error("DB error"));
        return request(app)
            .put("/questions")
            .send(fakePutBody)
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(response.body).toEqual({
                    error: "Failed to update question",
                });
                expect(db.updateQuestion).toHaveBeenLastCalledWith(
                    fakeIssueID, fakeDescription, fakeSummary, fakeCategory, fakeActive
                );
            });
    });
});
