// set up authentication
if (!process.env.CI) {
    require("dotenv").config({ path: "./.env.test" });
}
(async () => {
    var res = await fetch(
        "https://dev-i0ksanu2a66behjf.us.auth0.com/oauth/token",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: process.env.AUTH0_CLIENT_ID?.trim(),
                client_secret: process.env.AUTH0_CLIENT_SECRET?.trim(),
                audience: process.env.AUTH0_AUDIENCE?.trim(),
                grant_type: "client_credentials",
            }),
        },
    );

    var data = await res.json();
    const authToken = data.access_token;
    global.authToken = authToken;
})();
