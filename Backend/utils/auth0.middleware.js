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
                throw new InsufficientScopeError();
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
