const { Pool } = require("pg");
const secrets = require("./secrets");
const logger = require("../logger");

let pool;

if (process.env.SECRET_DB_CONN_PATH) {
    const connectionString = secrets.getConnString();
    pool = new Pool({ connectionString });
} else {
    pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: secrets.getUser(),
        password: secrets.getPassword(),
        database: "UnderStance",
    });
}

async function getQuestions() {
    try {
        const rows = await pool.query('SELECT * FROM "Issue"');
        return rows.rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getQuestionWithID(id) {
    if (!Number.isNaN(Number(id))) {
        const val = Number.parseInt(id);
        try {
            const rows = await pool.query(
                'SELECT * FROM "Issue" WHERE "IssueID" = $1',
                [val],
            );
            return rows.rows;
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
        const rows = await pool.query('SELECT * FROM "Stance"');
        return rows.rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getStancesFiltered(StanceID, IssueID, PartyID) {
    if (Number.isNaN(Number(StanceID)) || Number.isNaN(Number(IssueID)) || Number.isNaN(Number(PartyID))) {
        throw new Error("Invalid Argument");
    }
    const SID = Number.parseInt(StanceID) || StanceID;
    const IID = Number.parseInt(IssueID) || IssueID;
    const PID = Number.parseInt(PartyID) || PartyID;
    try {
        const rows = await pool.query(
            `SELECT * FROM "Stance"
            WHERE ($1::integer IS NULL OR "StanceID" = $1::integer)
            AND ($2::integer IS NULL OR "IssueID" = $2::integer)
            AND ($3::integer IS NULL OR "PartyID" = $3::integer)`,
            [SID, IID, PID],
        );
        return rows.rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getParties() {
    try {
        const rows = await pool.query('SELECT * FROM "Party"');
        return rows.rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getPartyWithID(id) {
    if (!Number.isNaN(Number(id))) {
        const val = Number.parseInt(id);
        try {
            const rows = await pool.query(
                'SELECT * FROM "Party" WHERE "PartyID" = $1::integer',
                [val],
            );
            return rows.rows;
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
};
