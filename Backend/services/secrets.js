const fs = require('fs');

function getSecret(path) {
    if (process.env.ENV === "test") {
        return "dummy";
    }
    try {
        const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
        return data.trim();
    } catch (err) {
        console.error(`Error occured while reading secret! ${err}`);
        return {};
    }
}

// Change your backend code to read DB credentials 
// from environment variables directly if secret file paths are not provided.
function getUser() {
    if (process.env.SECRET_USER_PATH) {
        return getSecret(process.env.SECRET_USER_PATH);
    } else if (process.env.DB_USER) {
        return process.env.DB_USER;
    }
    return null;
}

function getPassword() {
    if (process.env.SECRET_PASSWORD_PATH) {
        return getSecret(process.env.SECRET_PASSWORD_PATH);
    } else if (process.env.DB_PASSWORD) {
        return process.env.DB_PASSWORD;
    }
    return null;
}

function getConnString() {
    if (process.env.SECRET_DB_CONN_PATH) {
        return getSecret(process.env.SECRET_DB_CONN_PATH);
    } else if (process.env.DB_HOST && process.env.DB_PORT && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
        return `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    }
    return null;
}

module.exports = {
    getUser,
    getPassword,
    getConnString
}

