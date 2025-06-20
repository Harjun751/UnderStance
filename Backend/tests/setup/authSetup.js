// set up authentication
require('dotenv').config({ path: "./.env.test"});
(async function() {
    var res = await fetch("https://dev-i0ksanu2a66behjf.us.auth0.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: "client_credentials"
        }),
    });

    var data = await res.json();
    const authToken = data.access_token;
    global.authToken = authToken;
})()
