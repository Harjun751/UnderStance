const express = require("express");
const securedUserRoutes = express.Router();
const validator = require("../utils/input-validation");
const logger = require("../utils/logger");
const { management } = require("../utils/management-client");
const {
    permissions,
    checkRequiredPermissions,
} = require("../utils/auth0.middleware.js");

securedUserRoutes.get(
    "/users",
    checkRequiredPermissions([permissions.readUsers]),
    async (req, res) => {
        try {
            const allUsers = await management.users.getAll().then((resp) => resp.data);
            for (const user of allUsers) {
                const roles = await management.users.getRoles({ id: user.user_id });
                user.roles = roles.data.map(r => r.name).join(', ');
            }
            res.status(200).send(allUsers);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({ message: "Failed to get users." });
        }
    }
);

securedUserRoutes.get(
    "/roles",
    checkRequiredPermissions([permissions.readUsers]),
    async (req, res) => {
        try {
            const roles = await management.roles.getAll();
            res.status(200).send(roles.data);
        } catch (err) {
            logger.error(err.stack);
            //res.status(500).send({ message: "Failed to get roles" });
            res.status(500).send({ message: err.stack });
        }
    }
);

securedUserRoutes.post(
    "/users",
    checkRequiredPermissions([permissions.writeUsers]),
    async (req, res) => {
        const body = req.body;
        
        const iconError = await validator.validateIcon(body.Picture);
        if (iconError != null) {
            return res.status(400).send({
                error: "Invalid Arguments",
                details: `Invalid picture ${iconError}`,
            });
        }
       
        // temporary validate with party name validator
        // reasonable for most strings
        const validators = {
            Name: validator.validatePartyName,
            Email: validator.validatePartyName,
            Role: validator.validatePartyName
        };

        try {
            const resp = await management.users.create(
                {
                    connection: "Username-Password-Authentication",
                    name: body.Name,
                    email: body.Email,
                    picture: body.Picture,
                    password: "Password123",    // Look into email flow
                }
            ).then((resp) => resp.data);
            // assign role to user
            const user_id = resp.user_id;
            await management.users.assignRoles({ id: user_id }, { roles: [body.Role] });
            // send OK
            return res.status(200).send({ user_id: user_id });
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({stack: err.stack});
        }
    }
);

securedUserRoutes.patch(
    "/users",
    checkRequiredPermissions([permissions.writeUsers]),
    async (req, res) => {
        const body = req.body;

        if (body.Picture) {
            const iconError = await validator.validateIcon(body.Picture);
            if (iconError != null) {
                return res.status(400).send({
                    error: "Invalid Arguments",
                    details: `Invalid picture ${iconError}`,
                });
            }
        }


        // temporary validate with party name validator
        // reasonable for most strings
        const validators = {
            ID: validator.validatePartyName,
        };
        const errors = validator.validateData(validators, req.body);
        if (errors !== null) {
            return res
                .status(400)
                .send({ error: "Invalid Arguments", details: errors });
        }
        try {
            let reqBody;
            if (body.Name && body.Picture) {
                reqBody = { name: body.Name, picture: body.Picture }
            } else if (body.Name) {
                reqBody = { name: body.Name }
            } else if (body.Picture) {
                reqBody = { picture: body.Picture }
            } else {
                reqBody = {}
            }
            if (Object.keys(reqBody).length !== 0) {
                // update name and picture
                await management.users.update(
                    { id: body.ID },
                    reqBody
                );
            }
            if (body.Role) {
                // get previous roles and then remove them
                const currentRoles = await management.users.getRoles({ id: body.ID }).then((resp) => resp.data);
                if (currentRoles.length > 0 ) {
                    const roleIds = currentRoles.map(role => role.id);
                    await management.users.deleteRoles({ id: body.ID }, { roles: roleIds });
                }
                // add the requested role
                await management.users.assignRoles({ id: body.ID }, { roles: [body.Role] });
            }
            res.status(200).send({ user_id: body.ID });
        } catch (error) {
            logger.error(error.stack);
            res.status(500).send({ error: "Failed to update user" });
        }
    }
);

securedUserRoutes.delete(
    "/users/:id",
    checkRequiredPermissions([permissions.deleteUsers]),
    async (req, res) => {
        try {
            await management.users.delete({id: req.params.id });
            return res.status(200).send({ message: "Successfully deleted" });
        } catch(err) {
            logger.error(err.stack);
            res.status(500).send({error:"Failed to delete user"});
        }
    }
);
module.exports = { securedUserRoutes };
