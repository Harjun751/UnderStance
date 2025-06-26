module.exports = {
    frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5174",
    adminOrigin: process.env.ADMIN_ORIGIN || "http://localhost:5173",
    issuerBaseUrl:
        process.env.ISSUER_BASE_URL ||
        "https://dev-i0ksanu2a66behjf.us.auth0.com/",
    audience:
        process.env.AUDIENCE || "https://understance-backend.onrender.com/",
};
