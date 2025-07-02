const fs = require("node:fs");

function getSecret(path) {
    if (process.env.NODE_ENV === "test") {
        return "dummy";
    }
    try {
        const data = fs.readFileSync(path, { encoding: "utf8", flag: "r" });
        return data.trim();
    } catch (err) {
        console.error(`Error occured while reading secret! ${err}`);
        return {};
    }
}

function getUser() {
    return getSecret(process.env.SECRET_USER_PATH);
}

function getPassword() {
    return getSecret(process.env.SECRET_PASSWORD_PATH);
}

function getConnString() {
    return getSecret(process.env.SECRET_DB_CONN_PATH);
}

function getAuthDomain() {
    return getSecret(process.env.SECRET_AUTH0_DOMAIN_PATH);
}
function getAuthClientID() {
    return getSecret(process.env.SECRET_AUTH0_CLIENT_ID_PATH);
}
function getAuthClientSecret() {
    return getSecret(process.env.SECRET_AUTH0_CLIENT_SECRET_PATH);
}

module.exports = {
    getUser,
    getPassword,
    getConnString,
    getAuthDomain,
    getAuthClientID,
    getAuthClientSecret
};
