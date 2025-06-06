const fs = require("fs");

function getSecret(path) {
    if (process.env.ENV === "test") {
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

module.exports = {
    getUser,
    getPassword,
    getConnString,
};
