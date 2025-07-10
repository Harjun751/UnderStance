const { Pool } = require("pg");

jest.mock("pg");

// Mock db.query call that returns [rows,fields]
const mockQuery = jest.fn().mockResolvedValue({
    rows: [{ IssueID: 1, Description: "Test Issue", Summary: "Summary" }],
});

Pool.mockReturnValue({
    query: mockQuery,
});

const dal = require("../../utils/DAL");

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
                {
                    IssueID: 1,
                    Description: "Test Issue",
                    Summary: "Summary",
                    Active: true,
                },
            ],
        });
        const result = await dal.getQuestions(true);
        expect(result).toEqual([
            {
                IssueID: 1,
                Description: "Test Issue",
                Summary: "Summary",
                Active: true,
            },
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
        const result = await dal.getQuestionWithID(false, 1);
        expect(result).toEqual([
            { IssueID: 1, Description: "Test Issue", Summary: "Summary" },
        ]);
    });

    test("should return 1 row with details from Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                {
                    IssueID: 1,
                    Description: "Test Issue",
                    Summary: "Summary",
                    Active: true,
                },
            ],
        });
        const result = await dal.getQuestionWithID(true, 1);
        expect(result).toEqual([
            {
                IssueID: 1,
                Description: "Test Issue",
                Summary: "Summary",
                Active: true,
            },
        ]);
    });

    test("should return 0 rows from Issue", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        const result = await dal.getQuestionWithID(false, 2);
        expect(result).toEqual([]);
    });

    test("should error due to invalid argument", async () => {
        await expect(dal.getQuestionWithID(false, "abc")).rejects.toThrow(
            new Error("Invalid Argument"),
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.getQuestionWithID(false, 1)).rejects.toThrow(
            "DB kaput",
        );
    });
});

describe("mock POST question", () => {
    test("should add 1 row to Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [{ IssueID: 1 }],
        });
        await expect(
            dal.insertQuestion("Description", "Summary", "Category"),
        ).resolves.toBe(1);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.insertQuestion("", "", "")).rejects.toThrow(
            "DB kaput",
        );
    });

    test("should throw error if foreign key constraint violated", async () => {
        const error = new Error("FK violation");
        error.code = "23503"; //as per psql guideline
        mockQuery.mockRejectedValueOnce(error);
        await expect(dal.insertQuestion("", "", "")).rejects.toThrow(
            "Foreign Key Constraint Violation",
        );
    });
});

describe("mock PUT question", () => {
    test("should update and return Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                {
                    IssueID: 1,
                    Description: "Test Issue2",
                    Summary: "Summary2",
                    Category: "Category2",
                },
            ],
        });
        const result = await dal.updateQuestion(
            1,
            "Test Issue2",
            "Summary2",
            "Category2",
        );
        expect(result).toEqual({
            IssueID: 1,
            Description: "Test Issue2",
            Summary: "Summary2",
            Category: "Category2",
        });
    });

    test("should throw error if resource does not exist", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        await expect(dal.updateQuestion(1, "", "", "")).rejects.toThrow(
            "Invalid Resource",
        );
    });

    test("should throw error with invalid arguments", async () => {
        await expect(dal.updateQuestion("one", "", "", "")).rejects.toThrow(
            new Error("Invalid Argument"),
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.updateQuestion(1, "", "", "")).rejects.toThrow(
            "DB kaput",
        );
    });

    test("should throw error if foreign key constraint violated", async () => {
        const error = new Error("FK violation");
        error.code = "23503"; //as per psql guideline
        mockQuery.mockRejectedValueOnce(error);
        await expect(dal.updateQuestion(1, "", "", "")).rejects.toThrow(
            "Foreign Key Constraint Violation",
        );
    });
});

describe("mock DELETE question", () => {
    test("should delete Issue", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 1,
        });
        const result = await dal.deleteQuestion(1);
        expect(result).toEqual();
    });
    test("should throw error if no rows affected", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 0,
        });
        await expect(dal.deleteQuestion(1)).rejects.toThrow("Invalid Resource");
    });

    test("should throw error on invalid argument", async () => {
        await expect(dal.deleteQuestion("hi")).rejects.toThrow(
            "Invalid Argument",
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.deleteQuestion(1)).rejects.toThrow("DB kaput");
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
        const result = await dal.getStances(false);
        expect(result).toEqual(fakeStances);
    });

    test("should return stances when authenticated", async () => {
        mockQuery.mockResolvedValueOnce({ rows: fakeStances });
        const result = await dal.getStances(true);
        expect(result).toEqual(fakeStances);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.getStances(false)).rejects.toThrow("DB exploded");
    });
});

describe("mock GET stance with filter", () => {
    test("should return 1 stance with stance filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[0]] });
        const result = await dal.getStancesFiltered(false, 1, null, null);
        expect(result).toEqual([fakeStances[0]]);
    });

    test("should return 1 stance with stance filter when authenticated", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[0]] });
        const result = await dal.getStancesFiltered(true, 1, null, null);
        expect(result).toEqual([fakeStances[0]]);
    });

    test("should return 2 stances with issue filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: fakeStances });
        const result = await dal.getStancesFiltered(false, null, 1, null);
        expect(result).toEqual(fakeStances);
    });

    test("should return 1 stance with party filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[1]] });
        const result = await dal.getStancesFiltered(false, null, null, 2);
        expect(result).toEqual([fakeStances[1]]);
    });

    test("should return 1 stance with combined party and issue filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[1]] });
        const result = await dal.getStancesFiltered(false, null, 1, 2);
        expect(result).toEqual([fakeStances[1]]);
    });

    test("should return 0 stance with combined party and issue filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        const result = await dal.getStancesFiltered(false, null, 2, 2);
        expect(result).toEqual([]);
    });

    test("should return 1 stance with combined stance and issue filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[1]] });
        const result = await dal.getStancesFiltered(false, 2, 1, null);
        expect(result).toEqual([fakeStances[1]]);
    });

    test("should return 1 stance with combined stance and party filter", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [fakeStances[1]] });
        const result = await dal.getStancesFiltered(false, 2, null, 2);
        expect(result).toEqual([fakeStances[1]]);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(
            dal.getStancesFiltered(false, 1, null, null),
        ).rejects.toThrow("DB exploded");
    });

    test("should error due to invalid argument", async () => {
        await expect(dal.getStancesFiltered(false, "abc")).rejects.toThrow(
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
    test("should return parties", async () => {
        mockQuery.mockResolvedValueOnce({ rows: parties });
        const result = await dal.getParties(false);
        expect(result).toEqual(parties);
    });

    test("should return parties when authenticated", async () => {
        mockQuery.mockResolvedValueOnce({ rows: parties });
        const result = await dal.getParties(true);
        expect(result).toEqual(parties);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.getParties(false)).rejects.toThrow("DB exploded");
    });
});

describe("mock GET party filtered", () => {
    test("should return party with ID=1", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [parties[0]] });
        const result = await dal.getPartyWithID(false, 1);
        expect(result).toEqual([parties[0]]);
    });

    test("should return party with ID=1 when authenticated", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [parties[0]] });
        const result = await dal.getPartyWithID(true, 1);
        expect(result).toEqual([parties[0]]);
    });

    test("should return party with ID=2", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [parties[1]] });
        const result = await dal.getPartyWithID(false, 2);
        expect(result).toEqual([parties[1]]);
    });
    test("should return empty array if no match", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        const result = await dal.getPartyWithID(false, 3);
        expect(result).toEqual([]);
    });
    test("should error due to invalid argument", async () => {
        await expect(dal.getPartyWithID(false, "abc")).rejects.toThrow(
            new Error("Invalid Argument"),
        );
    });
    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.getPartyWithID(false, 2)).rejects.toThrow(
            "DB exploded",
        );
    });
});

describe("mock insert party", () => {
    test("should succeed", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ PartyID: 1 }] });
        const result = await dal.insertParty("", "", "", "", true);
        expect(result).toEqual(1);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.insertParty("", "", "", "", true)).rejects.toThrow(
            "DB exploded",
        );
    });
});

describe("mock update party", () => {
    test("should succeed", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [parties[0]] });
        const result = await dal.updateParty(1, "", "", "", "", true);
        expect(result).toEqual(parties[0]);
    });

    test("should throw error for invalid ID", async () => {
        await expect(
            dal.updateParty("hi", "", "", "", "", true),
        ).rejects.toThrow("Invalid Argument");
    });

    test("should throw error if no rows affected", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        await expect(dal.updateParty(1, "", "", "", "", true)).rejects.toThrow(
            "Invalid Resource",
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.insertParty("", "", "", "", true)).rejects.toThrow(
            "DB exploded",
        );
    });
});

describe("mock DELETE party", () => {
    test("should delete party", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 1,
        });
        const result = await dal.deleteParty(1);
        expect(result).toEqual();
    });
    test("should throw error if no rows affected", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 0,
        });
        await expect(dal.deleteParty(1)).rejects.toThrow("Invalid Resource");
    });

    test("should throw error on invalid argument", async () => {
        await expect(dal.deleteParty("hi")).rejects.toThrow("Invalid Argument");
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.deleteParty(1)).rejects.toThrow("DB kaput");
    });
});

const stance = {
    StanceID: 1,
    Stand: true,
    Reason: "hi",
    IssueID: 1,
    PartyID: 1,
};
describe("mock insert stance", () => {
    test("should succeed", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ StanceID: 1 }] });
        const result = await dal.insertStance(true, "", 1, 1);
        expect(result).toEqual(1);
    });

    test("should throw error on unique key violation", async () => {
        const error = new Error("UQ violation");
        error.code = "23505"; //as per psql guideline
        mockQuery.mockRejectedValueOnce(error);
        await expect(dal.insertStance(true, "", 1, 1)).rejects.toThrow(
            "Unique Constraint Violation",
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.insertStance(true, "", 1, 1)).rejects.toThrow(
            "DB exploded",
        );
    });
});

describe("mock update stance", () => {
    test("should succeed", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [stance] });
        const result = await dal.updateStance(1, true, "", 1, 1);
        expect(result).toEqual(stance);
    });

    test("should succeed", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        await expect(dal.updateStance(1, true, "", 1, 1)).rejects.toThrow(
            "Invalid Resource",
        );
    });

    test("should throw error on unique key violation", async () => {
        const error = new Error("UQ violation");
        error.code = "23505"; //as per psql guideline
        mockQuery.mockRejectedValueOnce(error);
        await expect(dal.updateStance(1, true, "", 1, 1)).rejects.toThrow(
            "Unique Constraint Violation",
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.updateStance(1, true, "", 1, 1)).rejects.toThrow(
            "DB exploded",
        );
    });
});

describe("mock DELETE stance", () => {
    test("should delete stance", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 1,
        });
        const result = await dal.deleteStance(1);
        expect(result).toEqual();
    });
    test("should throw error if no rows affected", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 0,
        });
        await expect(dal.deleteStance(1)).rejects.toThrow("Invalid Resource");
    });

    test("should throw error on invalid argument", async () => {
        await expect(dal.deleteStance("hi")).rejects.toThrow(
            "Invalid Argument",
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.deleteStance(1)).rejects.toThrow("DB kaput");
    });
});

const category = {
    CategoryID: 1,
    Name: "Dingus",
};

describe("mock GET question", () => {
    test("should return rows from Category", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [category],
        });
        const result = await dal.getCategories();
        expect(result).toEqual([category]);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.getCategories()).rejects.toThrow("DB exploded");
    });
});

describe("mock insert category", () => {
    test("should succeed", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ CategoryID: 1 }] });
        const result = await dal.insertCategory("Hi");
        expect(result).toEqual(1);
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.insertCategory("hi")).rejects.toThrow("DB exploded");
    });
});

describe("mock update category", () => {
    test("should succeed", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [category] });
        const result = await dal.updateCategory(1, "dingus");
        expect(result).toEqual(category);
    });

    test("should throw error on invalid resource", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        await expect(dal.updateCategory(1, "dingus2")).rejects.toThrow(
            "Invalid Resource",
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB exploded"));
        await expect(dal.updateCategory(1, "dingus2")).rejects.toThrow(
            "DB exploded",
        );
    });
});

describe("mock DELETE category", () => {
    test("should delete category", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 1,
        });
        const result = await dal.deleteCategory(1);
        expect(result).toEqual();
    });
    test("should throw error if no rows affected", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 0,
        });
        await expect(dal.deleteCategory(1)).rejects.toThrow("Invalid Resource");
    });

    test("should throw error on invalid argument", async () => {
        await expect(dal.deleteCategory("hi")).rejects.toThrow(
            "Invalid Argument",
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.deleteCategory(1)).rejects.toThrow("DB kaput");
    });
});

describe("mock GET dashboard", () => {
    const fakeDashboardData = [
        {
            UserID: "auth0|user1",
            Overall: { dingus: "wingus" },
            Tabs: { bingus: "lingus" },
        },
    ];
    test("should return rows from DashboardConfig", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: fakeDashboardData,
        });
        const result = await dal.getDashboard("auth0|user1");
        expect(result).toEqual(fakeDashboardData[0]);
    });

    test("should return empty object if no data", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [],
        });
        const result = await dal.getDashboard("auth0|user1");
        expect(result).toEqual(null);
    });
});

describe("mock create dashboard", () => {
    test("should create and return config", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                {
                    UserID: "auth0|user1",
                    Overall: "{}",
                    Tabs: "{}",
                },
            ],
        });
        const result = await dal.createDashboard("auth0|user1", "{}", "{}");
        expect(result).toEqual({
            UserID: "auth0|user1",
            Overall: "{}",
            Tabs: "{}",
        });
    });

    test("should throw error with invalid arguments", async () => {
        await expect(dal.createDashboard(1, "{}", "{}")).rejects.toThrow(
            new Error("Invalid Argument"),
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.createDashboard("1", "{}", "{}")).rejects.toThrow(
            "DB kaput",
        );
    });

    test("should throw error on invalid json: duplicate key", async () => {
        const error = new Error("Duplicate json object key");
        error.code = "22030"; //as per psql guideline
        mockQuery.mockRejectedValueOnce(error);
        await expect(
            dal.createDashboard(
                "auth0|user",
                '{"Bingus":1, "Bingus": 2}',
                "{}",
            ),
        ).rejects.toThrow("Invalid JSON text");
    });

    test("should throw error on invalid json text", async () => {
        const error = new Error("Duplicate json object key");
        error.code = "22032"; //as per psql guideline
        mockQuery.mockRejectedValueOnce(error);
        await expect(
            dal.createDashboard("auth0|user", '{"Bingus:1}', "{}"),
        ).rejects.toThrow("Invalid JSON text");
    });
});

describe("mock update dashboard", () => {
    test("should update and return config", async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [
                {
                    UserID: "auth0|user1",
                    Overall: {},
                    Tabs: {},
                },
            ],
        });
        const result = await dal.updateDashboard("auth0|user1", {}, {});
        expect(result).toEqual({
            UserID: "auth0|user1",
            Overall: {},
            Tabs: {},
        });
    });

    test("should throw error if resource does not exist", async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });
        await expect(dal.updateDashboard("1", {}, {})).rejects.toThrow(
            "Invalid Resource",
        );
    });

    test("should throw error with invalid arguments", async () => {
        await expect(dal.updateDashboard(1, {}, {})).rejects.toThrow(
            new Error("Invalid Argument"),
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.updateDashboard("1", {}, {})).rejects.toThrow(
            "DB kaput",
        );
    });

    test("should throw error on invalid json: duplicate key", async () => {
        const error = new Error("Duplicate json object key");
        error.code = "22030"; //as per psql guideline
        mockQuery.mockRejectedValueOnce(error);
        await expect(
            dal.updateDashboard("auth0|user", { Bingus: 1, Bingus2: 2 }, {}),
        ).rejects.toThrow("Invalid JSON text");
    });

    test("should throw error on invalid json text", async () => {
        const error = new Error("Duplicate json object key");
        error.code = "22032"; //as per psql guideline
        mockQuery.mockRejectedValueOnce(error);
        await expect(
            dal.updateDashboard("auth0|user", { Bingus: 1 }, {}),
        ).rejects.toThrow("Invalid JSON text");
    });
});

describe("mock DELETE dashboard", () => {
    test("should delete dashboard", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 1,
        });
        const result = await dal.deleteDashboard("1");
        expect(result).toEqual();
    });
    test("should throw error if no rows affected", async () => {
        mockQuery.mockResolvedValueOnce({
            rowCount: 0,
        });
        await expect(dal.deleteDashboard("1")).rejects.toThrow(
            "Invalid Resource",
        );
    });

    test("should throw error on invalid argument", async () => {
        await expect(dal.deleteDashboard({})).rejects.toThrow(
            "Invalid Argument",
        );
    });

    test("should throw error on DB fail", async () => {
        mockQuery.mockRejectedValueOnce(new Error("DB kaput"));
        await expect(dal.deleteDashboard("1")).rejects.toThrow("DB kaput");
    });
});
