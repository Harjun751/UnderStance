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

function getUser() {
    return getSecret('/run/secrets/mysql_user');
}

function getPassword() {
    return getSecret('/run/secrets/mysql_password');
}

module.exports = {
    getUser,
    getPassword,
}

