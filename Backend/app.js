const express = require('express')
const db = require('./services/DAL')
const logger = require('./logger')
const app = express()
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5174', // your React app origin
  methods: ['GET', 'POST'], // allowed methods
}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/questions',  async (req, res) => {
    const id = req.query.ID;
    if (id === undefined) {
        // simply return all
        try {
            const data = await db.getQuestions();
            res.status(200).send(data);
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({error : 'Failed to fetch questions' });
        }
    } else {
        if (!isNaN(id)) {
            try {
                const data = await db.getQuestionWithID(parseInt(id));
                res.status(200).send(data);
            } catch(error) {
                logger.error(error.stack);
                res.status(500).send({error : 'Failed to fetch questions' });
            }
        } else {
            res.status(400).send({error: 'Invalid Arguments'});
        }

    }
})

module.exports = app;
