const express = require('express')
const db = require('./services/DAL')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/questions',  async (req, res) => {
    try {
        const data = await db.getQuestions();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({error : 'Failed to fetch questions' });
    }
})

module.exports = app;
