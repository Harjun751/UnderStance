const { Pool } = require("pg");

jest.mock("pg");

// Mock db.query call that returns [rows,fields]
const mockQuery = jest.fn().mockResolvedValue({
    rows: [{ IssueID: 1, Description: "Test Issue", Summary: "Summary" }],
});

Pool.mockReturnValue({
    query: mockQuery,
});

const dal = require("../../services/DAL");

describe("mock GET question", () => {
    test("should return rows from Issue", async () => {
        const result = await dal.getQuestions(false);
        expect(result).toEqual([
            { IssueID: 1, Description: "Test Issue", Summary: "Summary" },
        ]);
    });

    test("should return rows and details from Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                { IssueID: 1, Description: "Test Issue", Summary: "Summary", Active: true },
            ],
        });
        const result = await dal.getQuestions(true);
        expect(result).toEqual([
            { IssueID: 1, Description: "Test Issue", Summary: "Summary", Active: true },
        ]);
    });

    test("should return [] from Issue", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        const result = await dal.getQuestions(false);
        expect(result).toEqual([]);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.getQuestions(false)).rejects.toThrow("DB kaput");
    });
});

describe("mock GET question with filter", () => {
    test("should return 1 row from Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                { IssueID: 1, Description: "Test Issue", Summary: "Summary" },
            ],
        });
        const result = await dal.getQuestionWithID(false,1);
        expect(result).toEqual([
            { IssueID: 1, Description: "Test Issue", Summary: "Summary" },
        ]);
    });

    test("should return 1 row with details from Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                { IssueID: 1, Description: "Test Issue", Summary: "Summary", Active: true },
            ],
        });
        const result = await dal.getQuestionWithID(true,1);
        expect(result).toEqual([
            { IssueID: 1, Description: "Test Issue", Summary: "Summary", Active: true },
        ]);
    });

    test("should return 0 rows from Issue", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        const result = await dal.getQuestionWithID(false,2);
        expect(result).toEqual([]);
    });

    test("should error due to invalid argument", async () => {
        await expect(dal.getQuestionWithID(false,"abc")).rejects.toThrow(
            new Error("Invalid Argument"),
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.getQuestionWithID(false,1)).rejects.toThrow("DB kaput");
    });
});

describe("mock POST question", () => {
    test("should add 1 row to Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                { IssueID: 1 }
        ]});
        await expect(dal.insertQuestion("Description", "Summary", "Category")).resolves.toBe(1);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.insertQuestion("","","")).rejects.toThrow("DB kaput");
    });

    // TODO: Validation for category?
});

describe("mock PUT question", () => {
    test("should update and return Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [{ IssueID: 1, Description: "Test Issue2", Summary: "Summary2", Category: "Category2" }],
        });
        const result = await dal.updateQuestion(1, "Test Issue2", "Summary2", "Category2");
        expect(result).toEqual(
            { IssueID: 1, Description: "Test Issue2", Summary: "Summary2", Category: "Category2" },
        );
    });

    test("should throw error if resource does not exist", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        await expect(dal.updateQuestion(1, "", "", "")).rejects.toThrow("Invalid Resource");
    });

    test("should throw error with invalid arguments", async () => {
        await expect(dal.updateQuestion("one","","","")).rejects.toThrow(
            new Error("Invalid Argument")
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.updateQuestion(1,"","","")).rejects.toThrow("DB kaput");
    });

});

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

describe("mock GET stance", () => {
    test("should return stances", async () => {
        mockQuery.mockResolvedValueOnce({ rows: fakeStances });
        const result = await dal.getStances();
        expect(result).toEqual(fakeStances);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.getStances()).rejects.toThrow("DB exploded");
    });
});

describe("mock GET stance with filter", () => {
    test("should return 1 stance with stance filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[0]] });
        const result = await dal.getStancesFiltered(1, null, null);
        expect(result).toEqual([fakeStances[0]]);
    });

    test("should return 2 stances with issue filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: fakeStances });
        const result = await dal.getStancesFiltered(null, 1, null);
        expect(result).toEqual(fakeStances);
    });

    test("should return 1 stance with party filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[1]] });
        const result = await dal.getStancesFiltered(null, null, 2);
        expect(result).toEqual([fakeStances[1]]);
    });

    test("should return 1 stance with combined party and issue filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[1]] });
        const result = await dal.getStancesFiltered(null, 1, 2);
        expect(result).toEqual([fakeStances[1]]);
    });

    test("should return 0 stance with combined party and issue filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        const result = await dal.getStancesFiltered(null, 2, 2);
        expect(result).toEqual([]);
    });

    test("should return 1 stance with combined stance and issue filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[1]] });
        const result = await dal.getStancesFiltered(2, 1, null);
        expect(result).toEqual([fakeStances[1]]);
    });

    test("should return 1 stance with combined stance and party filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[1]] });
        const result = await dal.getStancesFiltered(2, null, 2);
        expect(result).toEqual([fakeStances[1]]);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.getStancesFiltered(1, null, null)).rejects.toThrow(
            "DB exploded",
        );
    });

    test("should error due to invalid argument", async () => {
        await expect(dal.getStancesFiltered("abc")).rejects.toThrow(
            new Error("Invalid Argument"),
        );
    });
});

const parties = [
    {
        PartyID: 1,
        Name: "Coalition for Shakira",
        ShortName: "CFS",
        Icon: "https://cfs.com/icon.jpg",
    },
    {
        PartyID: 2,
        Name: "Traditionalist's Party",
        ShortName: "TP",
        Icon: "https://tp.com/icon.jpg",
    },
];

describe("mock GET party", () => {
    test("should return stances", async () => {
        mockQuery.mockResolvedValueOnce({ rows: parties });
        const result = await dal.getParties();
        expect(result).toEqual(parties);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.getParties()).rejects.toThrow("DB exploded");
    });
});

describe("mock GET party filtered", () => {
    test("should return party with ID=1", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [parties[0]] });
        const result = await dal.getPartyWithID(1);
        expect(result).toEqual([parties[0]]);
    });
    test("should return party with ID=2", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [parties[1]] });
        const result = await dal.getPartyWithID(2);
        expect(result).toEqual([parties[1]]);
    });
    test("should return empty array if no match", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        const result = await dal.getPartyWithID(3);
        expect(result).toEqual([]);
    });
    test("should error due to invalid argument", async () => {
        await expect(dal.getPartyWithID("abc")).rejects.toThrow(
            new Error("Invalid Argument"),
        );
    });
    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.getPartyWithID(2)).rejects.toThrow("DB exploded");
    });
});
