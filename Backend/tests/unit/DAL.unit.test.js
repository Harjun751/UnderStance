const mysql = require('mysql2/promise');

jest.mock('mysql2/promise');

// Mock db.query call that returns [rows,fields]
let mockQuery = jest.fn().mockResolvedValue([
    [{IssueID: 1, Description: 'Test Issue', Summary: 'Summary' }],
    []
]);
let mockExecute = jest.fn();

mysql.createPool.mockReturnValue({
    query: mockQuery,
    execute: mockExecute
});

const dal = require('../../services/DAL');

describe('mock GET question', () => {
    test('should return rows from Issue', async () => {
        const result = await dal.getQuestions();
        expect(result).toEqual([
          { IssueID: 1, Description: 'Test Issue', Summary: 'Summary' }
        ]);
        expect(mockQuery).toHaveBeenLastCalledWith('SELECT * FROM Issue');
    });

    test('should return [] from Issue', async () => {
        mockQuery.mockResolvedValueOnce([[],[]]);
        const result = await dal.getQuestions();
        expect(result).toEqual([]);
        expect(mockQuery).toHaveBeenLastCalledWith('SELECT * FROM Issue');
    });

    test('should throw error on DB fail', async () => {
        mockQuery.mockRejectedValueOnce(new Error('DB kaput'));
        await expect(dal.getQuestions()).rejects.toThrow('DB kaput');
    });

});

describe('mock GET question with filter', () => {
    test('should return 1 row from Issue', async () => {
        mockQuery.mockResolvedValueOnce([
            [{IssueID: 1, Description: 'Test Issue', Summary: 'Summary' }],
            []
        ]);
        const result = await dal.getQuestionWithID(1);
        expect(result).toEqual(
            [{IssueID: 1, Description: 'Test Issue', Summary: 'Summary' }]
        );
        expect(mockQuery).toHaveBeenLastCalledWith('SELECT * FROM Issue WHERE IssueID = 1');
    });

    test('should return 0 rows from Issue', async () => {
        mockQuery.mockResolvedValueOnce([
            [],
            []
        ]);
        const result = await dal.getQuestionWithID(2);
        expect(result).toEqual([]);
        expect(mockQuery).toHaveBeenLastCalledWith('SELECT * FROM Issue WHERE IssueID = 2');
    });

    test('should error due to invalid argument', async () => {
        await expect(dal.getQuestionWithID('abc')).rejects.toThrow(new Error('Invalid Argument'));
    });

    test('should throw error on DB fail', async () => {
        mockQuery.mockRejectedValueOnce(new Error('DB kaput'));
        await expect(dal.getQuestionWithID(123)).rejects.toThrow('DB kaput');
    });

});

describe('mock GET stance', () => {
    test('should return stances', async () => {
        const fakeStances = [
            [
                {
                    StanceID: 1,
                    Stand: true,
                    Reason: "Who can argue against such a banger",
                    IssueID: 1,
                    PartyID: 1
                },
                {
                    StanceID: 2,
                    Stand: false,
                    Reason: "I think our national anthem is perfectly fine",
                    IssueID: 1,
                    PartyID: 2
                }
            ],
            []
        ];
        mockQuery.mockResolvedValueOnce(fakeStances);
        const result = await dal.getStances();
        expect(result).toEqual(fakeStances[0]);
        expect(mockQuery).toHaveBeenLastCalledWith('SELECT * FROM Stance');
    });
    
    test('should throw error on DB fail', async () => {
        mockQuery.mockRejectedValueOnce(new Error('DB exploded'));
        await expect(dal.getStances()).rejects.toThrow('DB exploded');
    });
});

describe('mock GET stance with filter', () => {
    test('should return 1 stance with stance filter', async () => {
        const fakeStance = {
            StanceID: 1,
            Stand: true,
            Reason: "Who can argue against such a banger",
            IssueID: 1,
            PartyID: 1
        }
        mockExecute.mockResolvedValueOnce([[fakeStance], []]);
        const result = await dal.getStancesFiltered(1, null, null);
        expect(result).toEqual([fakeStance]);
    });

    test('should return 2 stances with issue filter', async () => {
        const fakeStances = [
                {
                    StanceID: 1,
                    Stand: true,
                    Reason: "Who can argue against such a banger",
                    IssueID: 1,
                    PartyID: 1
                },
                {
                    StanceID: 2,
                    Stand: false,
                    Reason: "I think our national anthem is perfectly fine",
                    IssueID: 1,
                    PartyID: 2
                }
            ];
        mockExecute.mockResolvedValueOnce([fakeStances, []]);
        const result = await dal.getStancesFiltered(null, 1, null);
        expect(result).toEqual(fakeStances);
    });

    test('should return 1 stance with party filter', async () => {
        const fakeStances = [
                {
                    StanceID: 2,
                    Stand: false,
                    Reason: "I think our national anthem is perfectly fine",
                    IssueID: 1,
                    PartyID: 2
                }
            ];
        mockExecute.mockResolvedValueOnce([fakeStances, []]);
        const result = await dal.getStancesFiltered(null, null, 2);
        expect(result).toEqual(fakeStances);
    });

    test('should return 1 stance with combined party and issue filter', async () => {
        const fakeStances = [
                {
                    StanceID: 2,
                    Stand: false,
                    Reason: "I think our national anthem is perfectly fine",
                    IssueID: 1,
                    PartyID: 2
                }
            ];
        mockExecute.mockResolvedValueOnce([fakeStances, []]);
        const result = await dal.getStancesFiltered(null, 1, 2);
        expect(result).toEqual(fakeStances);
    });

    test('should return 0 stance with combined party and issue filter', async () => {
        const fakeStances = [];
        mockExecute.mockResolvedValueOnce([fakeStances, []]);
        const result = await dal.getStancesFiltered(null, 2, 2);
        expect(result).toEqual(fakeStances);
    });

    test('should return 1 stance with combined stance and issue filter', async () => {
        const fakeStances = [
                {
                    StanceID: 2,
                    Stand: false,
                    Reason: "I think our national anthem is perfectly fine",
                    IssueID: 1,
                    PartyID: 2
                }
            ];
        mockExecute.mockResolvedValueOnce([fakeStances, []]);
        const result = await dal.getStancesFiltered(2, 1, null);
        expect(result).toEqual(fakeStances);
    });

    test('should return 1 stance with combined stance and party filter', async () => {
        const fakeStances = [
                {
                    StanceID: 2,
                    Stand: false,
                    Reason: "I think our national anthem is perfectly fine",
                    IssueID: 1,
                    PartyID: 2
                }
            ];
        mockExecute.mockResolvedValueOnce([fakeStances, []]);
        const result = await dal.getStancesFiltered(2, null, 2);
        expect(result).toEqual(fakeStances);
    });

    test('should error due to invalid argument', async () => {
        await expect(dal.getQuestionWithID('abc', 'def', 'hij')).rejects.toThrow(new Error('Invalid Argument'));
    });

});

const parties = [
    {
        PartyID: 1,
        Name: "Coalition for Shakira",
        ShortName: "CFS",
        Icon: "https://cfs.com/icon.jpg"
    },
    {
        PartyID: 2,
        Name: "Traditionalist's Party",
        ShortName: "TP",
        Icon: "https://tp.com/icon.jpg"
    }
];

describe('mock GET party', () => {
    test('should return stances', async () => {
        mockQuery.mockResolvedValueOnce([parties, []]);
        const result = await dal.getParties();
        expect(result).toEqual(parties);
        expect(mockQuery).toHaveBeenLastCalledWith('SELECT * FROM Party');
    });
    
    test('should throw error on DB fail', async () => {
        mockQuery.mockRejectedValueOnce(new Error('DB exploded'));
        await expect(dal.getParties()).rejects.toThrow('DB exploded');
    });
});

describe('mock GET party filtered', () => {
    test('should return party with ID=1', async () => {
        mockExecute.mockResolvedValueOnce([[parties[0]], []]);
        const result = await dal.getPartyWithID(1);
        expect(result).toEqual([parties[0]]);
    });
    test('should return party with ID=2', async () => {
        mockExecute.mockResolvedValueOnce([[parties[1]], []]);
        const result = await dal.getPartyWithID(2);
        expect(result).toEqual([parties[1]]);
    });
    test('should return empty array if no match', async () => {
        mockExecute.mockResolvedValueOnce([[], []]);
        const result = await dal.getPartyWithID(3);
        expect(result).toEqual([]);
    });
    test('should error due to invalid argument', async () => {
        await expect(dal.getPartyWithID('abc')).rejects.toThrow(new Error('Invalid Argument'));
    });
    test('should throw error on DB fail', async () => {
        mockExecute.mockRejectedValueOnce(new Error('DB exploded'));
        await expect(dal.getPartyWithID(2)).rejects.toThrow('DB exploded');
    });
});
