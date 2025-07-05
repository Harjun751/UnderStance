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
        return null;
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

function getGa4ServiceAcc() {
    let service_acc = getSecret(process.env.SECRET_GA4_ACC_PATH);
    if (service_acc === null) {
         service_acc = process.env.GA4_SERVICE_ACCOUNT_JSON;
    }
    return service_acc
}

function getGa4PropID() {
    let ga4_prop_id = getSecret(process.env.SECRET_GA4_PROP_ID_PATH); 
    if (ga4_prop_id === null) {
        ga4_prop_id = process.env.GA4_PROPERTY_ID;
    }
    return ga4_prop_id;
}

module.exports = {
    getUser,
    getPassword,
    getConnString,
    getGa4ServiceAcc,
    getGa4PropID
};
