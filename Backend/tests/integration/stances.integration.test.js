const request = require('supertest')
const setupCompose = require('../setup/setupCompose')
const teardownCompose = require('../setup/teardownCompose')
const appPort = 3003

beforeAll(async () => {
  await setupCompose(appPort)
}, 60_000)

afterAll(() => {
  teardownCompose(appPort)
})

const fakeStances = [
  {
    StanceID: 1,
    Stand: true,
    Reason: "It's a certified bop",
    IssueID: 1,
    PartyID: 1
  },
  {
    StanceID: 2,
    Stand: true,
    Reason: 'The current one is good enough TBH',
    IssueID: 1,
    PartyID: 2
  }
]

describe('GET stances', () => {
  test('200 OK GET all', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(fakeStances)
  })

  test('200 OK GET party filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?PartyID=2')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([fakeStances[1]])
  })

  test('200 OK GET IssueID filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?IssueID=1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(fakeStances)
  })

  test('200 OK GET IssueID empty filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?IssueID=2')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })

  test('200 OK GET StanceID filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?StanceID=1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([fakeStances[0]])
  })

  test('200 OK GET combined Issue Stance filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?StanceID=2&IssueID=1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([fakeStances[1]])
  })

  test('200 OK GET combined Issue Party filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?PartyID=2&IssueID=1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([fakeStances[1]])
  })

  test('200 OK GET combined Stance Party filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?PartyID=1&StanceID=1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([fakeStances[0]])
  })

  test('200 OK GET combined filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?StanceID=1&PartyID=1&IssueID=1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([fakeStances[0]])
  })

  test('200 OK GET combined filtered alt', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?StanceID=2&PartyID=2&IssueID=1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([fakeStances[1]])
  })

  test('200 OK GET combined filtered empty', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?StanceID=2&PartyID=2&IssueID=2')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })

  test('400 Invalid Arguments with bad query params', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/stances?StanceID=1&PartyID=ABCD&IssueID=1')
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid Arguments' })
  })
})
