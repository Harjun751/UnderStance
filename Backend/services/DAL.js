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

async function getQuestions(isAuthenticated) {
    let query;
    if (isAuthenticated) {
        // Return all info
        query = 'SELECT * FROM "Issue"';
    } else {
        // return only active questions
        query = 'SELECT "IssueID", "Description", "Summary", "Category" FROM "Issue" WHERE "Active" = true';
    }
    try {
        const rows = await pool.query(query);
        return rows.rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getQuestionWithID(isAuthenticated, id) {
    let query;
    if (isAuthenticated) {
        query = 'SELECT * FROM "Issue" WHERE "IssueID" = $1';
    } else {
        query = 'SELECT "IssueID", "Description", "Summary", "Category" FROM "Issue" WHERE "Active" = true AND "IssueID" = $1';
    }
    if (!Number.isNaN(Number(id))) {
        const val = Number.parseInt(id);
        try {
            const rows = await pool.query(
                query,
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

async function insertQuestion(description, summary, category, active) {
    try {
        const rows = await pool.query(
            `INSERT INTO "Issue" ("Description", "Summary", "Category", "Active")
             VALUES ($1, $2, $3, $4)
             RETURNING "IssueID"
            `, [description, summary, category, active]
        );
        return rows.rows[0].IssueID;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function updateQuestion(id, description, summary, category, active) {
    if (!Number.isNaN(Number(id))) {
        const val = Number.parseInt(id);
        try {
            const rows = await pool.query(
                `UPDATE "Issue"
                 SET "Description" = $1,
                     "Summary" = $2,
                     "Category" = $3,
                     "Active" = $4
                 WHERE "IssueID" = $5
                 RETURNING *
                `, [description, summary, category, active, val]
            );
            if (rows.rows.length === 0) {
                throw new Error("Invalid Resource");
            }
            return rows.rows[0];
        } catch (err) {
            logger.error(err.stack);
            throw err;
        }
    } else {
        throw new Error("Invalid Argument");
    }
}

async function deleteQuestion(id) {
    if (!Number.isNaN(Number(id))) {
        const val = Number.parseInt(id);
        try {
            const rows = await pool.query(
                `DELETE FROM "Issue" WHERE "IssueID" = $1`
                , [val]
            );
            if (rows.rowCount === 0) {
                throw new Error("Invalid Resource");
            }
            return;
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
    if (
        Number.isNaN(Number(StanceID)) ||
        Number.isNaN(Number(IssueID)) ||
        Number.isNaN(Number(PartyID))
    ) {
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

async function getParties(isAuthenticated) {
    let query;
    if (isAuthenticated) {
        // Return all info
        query = 'SELECT * FROM "Party"';
    } else {
        // return only active questions
        query = 'SELECT "PartyID", "Name", "ShortName", "Icon", "PartyColor" FROM "Party" WHERE "Active" = true';
    }
    try {
        const rows = await pool.query(query);
        return rows.rows;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function getPartyWithID(isAuthenticated, id) {
    let query;
    if (isAuthenticated) {
        // Return all info
        query = 'SELECT * FROM "Party" WHERE "PartyID" = $1::integer';
    } else {
        // return only active questions
        query = 'SELECT "PartyID", "Name", "ShortName", "Icon", "PartyColor" FROM "Party" WHERE "Active" = true AND "PartyID" = $1::integer';
    }
    if (!Number.isNaN(Number(id))) {
        const val = Number.parseInt(id);
        try {
            const rows = await pool.query(
                query,
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

async function insertParty(name, shortName, icon, partyColor, active) {
    try {
        const rows = await pool.query(
            `INSERT INTO "Party" ("Name", "ShortName", "Icon", "PartyColor", "Active")
             VALUES ($1, $2, $3, $4, $5)
             RETURNING "PartyID"
            `, [name, shortName, icon, partyColor, active]
        );
        return rows.rows[0].PartyID;
    } catch (err) {
        logger.error(err.stack);
        throw err;
    }
}

async function updateParty(id, name, shortName, icon, partyColor, active) {
    if (!Number.isNaN(Number(id))) {
        const val = Number.parseInt(id);
        try {
            const rows = await pool.query(
                `UPDATE "Party"
                 SET "Name" = $1,
                     "ShortName" = $2,
                     "Icon" = $3,
                     "PartyColor" = $4,
                     "Active" = $5
                 WHERE "PartyID" = $6
                 RETURNING *
                `, [name, shortName, icon, partyColor, active, val]
            );
            if (rows.rows.length === 0) {
                throw new Error("Invalid Resource");
            }
            return rows.rows[0];
        } catch (err) {
            logger.error(err.stack);
            throw err;
        }
    } else {
        throw new Error("Invalid Argument");
    }
}

async function deleteParty(id) {
    if (!Number.isNaN(Number(id))) {
        const val = Number.parseInt(id);
        try {
            const rows = await pool.query(
                `DELETE FROM "Party" WHERE "PartyID" = $1`
                , [id]
            );
            if (rows.rowCount === 0) {
                throw new Error("Invalid Resource");
            }
            return;
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
    insertQuestion,
    updateQuestion,
    deleteQuestion,
    deleteParty,
    updateParty,
    insertParty
};
