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

module.exports = {
    getQuestions,
};
