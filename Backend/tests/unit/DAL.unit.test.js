const mysql = require('mysql2/promise');

jest.mock('mysql2/promise');

// Mock db.query call that returns [rows,fields]
let mockQuery = jest.fn().mockResolvedValue([
    [{IssueID: 1, Description: 'Test Issue', Summary: 'Summary' }],
    []
]);

mysql.createPool.mockReturnValue({
    query: mockQuery
});

const dal = require('../../services/DAL');

describe('mock GET question', () => {
    test('should return rows from Issue', async () => {
        const result = await dal.getQuestions();
        expect(result).toEqual([
          { IssueID: 1, Description: 'Test Issue', Summary: 'Summary' }
        ]);
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM Issue');
    });

    test('should return [] from Issue', async () => {
        mockQuery.mockResolvedValueOnce([[],[]]);
        const result = await dal.getQuestions();
        expect(result).toEqual([]);
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM Issue');
    });

    test('should throw error on DB fail', async () => {
        mockQuery.mockRejectedValueOnce(new Error('DB kaput'));
        await expect(dal.getQuestions()).rejects.toThrow('DB kaput');
    });
});
