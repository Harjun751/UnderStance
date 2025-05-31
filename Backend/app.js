const express = require('express')
const db = require('./services/DAL')
const logger = require('./logger')
const app = express()
const cors = require('cors')

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5174';

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST'],
}));


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

app.get('/stances', async (req, res) => {
    var StanceID = req.query.StanceID;
    var IssueID = req.query.IssueID;
    var PartyID = req.query.PartyID;
    if (StanceID === undefined && IssueID === undefined && PartyID === undefined) {
        // return all
        try {
            const data = await db.getStances();
            res.status(200).send(data);
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({error: 'Failed to fetch stances'});
        }
    } else {
        // Convert undefined values into null
        StanceID = StanceID ?? null;
        IssueID = IssueID ?? null;
        PartyID = PartyID ?? null;
        // Check if they are invalid as numbers
        if (isNaN(StanceID) || isNaN(IssueID) || isNaN(PartyID)) {
            res.status(400).send({error: 'Invalid Arguments'});
        } else {
            try {
                // parseInt(null) == NaN
                // We want to pass null if filter is not being used
                // so coerce into null if required with ||
                const data = await db.getStancesFiltered(
                    parseInt(StanceID) || null,
                    parseInt(IssueID) || null,
                    parseInt(PartyID) || null
                );
                res.status(200).send(data);
            } catch(error) {
                logger.error(error.stack);
                res.status(500).send({error: 'Failed to fetch stances'});
            }
        }
    }
});

app.get('/parties',  async (req, res) => {
    const id = req.query.ID;
    if (id === undefined) {
        // simply return all
        try {
            const data = await db.getParties();
            res.status(200).send(data);
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({error : 'Failed to fetch parties' });
        }
    } else {
        if (!isNaN(id)) {
            try {
                const data = await db.getPartyWithID(parseInt(id));
                res.status(200).send(data);
            } catch(error) {
                logger.error(error.stack);
                res.status(500).send({error : 'Failed to fetch parties' });
            }
        } else {
            res.status(400).send({error: 'Invalid Arguments'});
        }
    }
})



module.exports = app;
