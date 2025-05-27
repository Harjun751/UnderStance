const mysql = require('mysql2/promise')
const secrets = require('./secrets')
const logger = require('../logger')

const user = secrets.getUser();
const pw = secrets.getPassword();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: user,
    password: pw,
    database: 'UnderStance',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
            // convert 1/0 to JS boolean types
            return field.string() === '1';
        }
        return next();
    }
});

async function getQuestions() {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM Issue');
        return rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getQuestionWithID(id) {
    if (!isNaN(id)) {
        const val = parseInt(id);
        try {
            const [rows, fields] = await pool.query(`SELECT * FROM Issue WHERE IssueID = ${val}`);
            return rows;
        } catch (err) {
            logger.error(err.stack);
            throw err;
        }
    } else {
        throw new Error("Invalid Argument");
    }
}

async function getStances() {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM Stance');
        return rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getStancesFiltered(StanceID, IssueID, PartyID) {
    if (isNaN(StanceID) || isNaN(IssueID) || isNaN(PartyID)) {
        throw new Error("Invalid Argument");
    }
    if (StanceID != null) { StanceID = parseInt(StanceID); }
    if (IssueID != null) { IssueID = parseInt(IssueID); }
    if (PartyID != null) { PartyID = parseInt(PartyID); }
    try {
        const [rows, fields] = await pool.execute(
            `SELECT * FROM Stance
            WHERE (? IS NULL OR StanceID = ?)
            AND (? IS NULL OR IssueID = ?)
            AND (? IS NULL OR PartyID = ?)`,
            [StanceID, StanceID, IssueID, IssueID, PartyID, PartyID]
        );
        return rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getParties() {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM Party');
        return rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getPartyWithID(id) {
    if (!isNaN(id)) {
        const val = parseInt(id);
        try {
            const [rows, fields] = await pool.execute(
                `SELECT * FROM Party WHERE PartyID = ?`,
                [val]
            );
            return rows;
        } catch (err) {
            logger.error(err.stack);
            throw err;
        }
    } else {
        throw new Error("Invalid Argument");
    }
}


module.exports = {
    getStancesFiltered,
    getStances,
    getQuestionWithID,
    getQuestions,
    getParties,
    getPartyWithID,
}

