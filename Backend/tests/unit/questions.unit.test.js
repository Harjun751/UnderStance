const app = require('../../app')
const request = require('supertest')
jest.mock('../../services/DAL')
const db = require('../../services/DAL')

describe('mock GET quiz question', () => {
  test('should return 200 OK', () => {
    const fakeQuestions = [
      {
        IssueID: 1,
        Description: 'Mock Question',
        Summary: 'nil'
      }
    ]
    db.getQuestions.mockResolvedValue(fakeQuestions)
    return request(app)
      .get('/questions')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeQuestions)
      })
  })

  test('should return 200 OK and [] for empty set', () => {
    const fakeQuestions = []
    db.getQuestions.mockResolvedValue(fakeQuestions)
    return request(app)
      .get('/questions')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeQuestions)
      })
  })

  test('should return 500 if DB error', () => {
    db.getQuestions.mockRejectedValue(new Error('DB error'))
    return request(app)
      .get('/questions')
      .then((response) => {
        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual({ error: 'Failed to fetch questions' })
      })
  })
})

describe('mock GET quiz question with filter', () => {
  test('should return 200 OK with 1 row', () => {
    const fakeQuestions = [
      {
        IssueID: 1,
        Description: 'Mock Question',
        Summary: 'nil'
      }
    ]
    db.getQuestionWithID.mockResolvedValue(fakeQuestions)
    return request(app)
      .get('/questions?ID=1')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeQuestions)
        expect(db.getQuestionWithID).toHaveBeenCalledWith(1)
      })
  })

  test('should return 200 OK with 0 rows', () => {
    const fakeQuestions = []
    db.getQuestionWithID.mockResolvedValue(fakeQuestions)
    return request(app)
      .get('/questions?ID=2')
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeQuestions)
        expect(db.getQuestionWithID).toHaveBeenCalledWith(2)
      })
  })

  test('should return 400 if invalid argument', () => {
    return request(app)
      .get('/questions?ID=animalmoneyisthefuture')
      .then((response) => {
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ error: 'Invalid Arguments' })
      })
  })

  test('should return 500 if DB error', () => {
    db.getQuestionWithID.mockRejectedValue(new Error('DB error'))
    return request(app)
      .get('/questions?ID=3')
      .then((response) => {
        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual({ error: 'Failed to fetch questions' })
        expect(db.getQuestionWithID).toHaveBeenCalledWith(3)
      })
  })
})
