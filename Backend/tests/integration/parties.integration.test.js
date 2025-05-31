const app = require('../../app')
const request = require('supertest')
const setupCompose = require('../setup/setupCompose')
const teardownCompose = require('../setup/teardownCompose')
const appPort = 3004

beforeAll(async () => {
  await setupCompose(appPort)
}, 60_000)

afterAll(() => {
  teardownCompose(appPort)
})

const parties = [
  {
    PartyID: 1,
    Name: 'Coalition for Shakira',
    ShortName: 'CFS',
    Icon: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fm%2FnsIzrgTUb6sAAAAC%2Fmonday-left-me-broken-cat.gif&f=1&nofb=1&ipt=037bc199f0a9705f2ffda49a41302c4a674c8d69748df626cd8e70491f1f379d'
  },
  {
    PartyID: 2,
    Name: "Traditionalists' Party",
    ShortName: 'TP',
    Icon: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpkbnews.in%2Fwp-content%2Fuploads%2F2023%2F09%2FBlue-Smurf-Cat-Meme.jpg&f=1&nofb=1&ipt=075c2e738b6abfc14555b49cfe8fe2d14433f12cdec84ab46b87516cca95278f'
  }
]

describe('GET stances', () => {
  test('200 OK GET all', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/parties')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(parties)
  })

  test('200 OK GET party filtered id=1', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/parties?ID=1')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([parties[0]])
  })

  test('200 OK GET party filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/parties?ID=2')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([parties[1]])
  })

  test('200 OK GET IssueID empty filtered', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/parties?ID=4')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
  })

  test('400 Invalid Arguments with bad query params', async () => {
    const response = await request(`http://localhost:${appPort}`)
      .get('/parties?ID=abc')
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid Arguments' })
  })
})
