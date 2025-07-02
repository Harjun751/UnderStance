const config = require("./app-config");

const {
    auth,
    claimCheck,
    InsufficientScopeError,
} = require("express-oauth2-jwt-bearer");

const permissions = {
    read: "read:resources",
    write: "write:resources",
    delete: "delete:resources",
    readUsers: "read:users",
    writeUsers: "write:users",
    deleteUsers: "delete:users"
};

const checkValidAccessToken = auth({
    issuerBaseURL: config.issuerBaseUrl,
    audience: config.audience,
    tokenSigningAlg: "RS256",
    authRequired: false,
});

const requireValidAccessToken = auth({
    issuerBaseURL: config.issuerBaseUrl,
    audience: config.audience,
    tokenSigningAlg: "RS256",
});

const checkRequiredPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        const permissionCheck = claimCheck((payload) => {
            const permissions = payload.permissions || [];

            const hasPermissions = requiredPermissions.every(
                (requiredPermission) =>
                    permissions.includes(requiredPermission),
            );

            if (!hasPermissions) {
                const perms = requiredPermissions.join(", ");
                return res.status(403).send({
                    error: "You don't have permissions to access this resource.",
                    details: `You need the scope(s): ${perms}`
                });
            }

            return hasPermissions;
        });

        permissionCheck(req, res, next);
    };
};

module.exports = {
    checkValidAccessToken,
    requireValidAccessToken,
    checkRequiredPermissions,
    permissions,
};
