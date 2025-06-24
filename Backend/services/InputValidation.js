const logger = require("../logger");

function validateData(validators, data) {
    const invalidFields = Object.entries(validators)
        .map(([fieldName, validator]) => [
            fieldName,
            validator(data[fieldName]),
        ])
        .filter(([_fieldName, errorDetail]) => errorDetail != null)
        .map(([fieldName, errorDetail]) => `${fieldName} (${errorDetail})`);

    if (!invalidFields.length) {
        return null;
    }
    return `There are invalid field(s): ${invalidFields.join(", ")}`;
}

function validateDescription(desc) {
    if (typeof desc !== "undefined" && desc) {
        if (desc.length > 300) {
            return "Too long, >300 characters";
        } else {
            return null;
        }
    } else {
        return "No value provided";
    }
}

function validateSummary(summary) {
    if (typeof summary !== "undefined" && summary) {
        if (summary.length > 50) {
            return "Too long, > 50 characters";
        } else {
            return null;
        }
    } else {
        return "No value provided";
    }
}

function validateCategory(category) {
    if (typeof category !== "undefined" && category) {
        if (category.length > 50) {
            return "Too long, > 50 characters";
        }
        return null;
    } else {
        return "No value provided";
    }
}

function validateID(id) {
    if (typeof id !== "undefined" && id) {
        if (Number.isNaN(Number(id))) {
            return "Not a valid number";
        }
        return null;
    }
    return "No value provided";
}

function validateActive(active) {
    if (typeof active !== "undefined" && active !== null) {
        if (typeof active === "boolean") {
            return null;
        }
        if (
            active.toLowerCase() === "true" ||
            active.toLowerCase() === "false"
        ) {
            return null;
        }
        return "Invalid boolean value";
    }
    return "No value provided";
}

function convertToBoolean(active) {
    // assume input is clean
    if (typeof active === "boolean") {
        return active;
    }
    return active.toLowerCase() === "true";
}

function validateShortName(name) {
    if (typeof name !== "undefined" && name) {
        if (name.length <= 5) {
            return null;
        } else {
            return "Too long, >5 characters";
        }
    } else {
        return "No value provided";
    }
}

async function validateIcon(icon) {
    if (typeof icon !== "undefined" && icon) {
        if (icon.length > 2083) {
            return "Too long, >2083 characters";
        }
        // Check that provided URL leads to a proper image resource
        // do this by doing a fetch and read metadata
        let response;
        try {
            response = await fetch(icon, { method: "HEAD" });
        } catch (err) {
            logger.error(err.stack);
            return "Failed to reach";
        }
        if (!response.ok) {
            return "Invalid URL - failed to reach";
        }
        const contentType = response.headers.get("content-type");
        // check that content type is an image type
        if (contentType?.startsWith("image/")) {
            return null;
        }
        return "Invalid URL - not an image";
    } else {
        return "No value provided";
    }
}

function validateColor(color) {
    if (typeof color !== "undefined" && color) {
        const hexColorRegex = /^#([A-Fa-f0-9]{3,6})$/;
        if (color.length > 7 || !hexColorRegex.test(color)) {
            return "Not a valid hex color code";
        }
        return null;
    } else {
        return "No value provided";
    }
}

function validatePartyName(name) {
    if (typeof name !== "undefined" && name) {
        if (name.length > 100) {
            return "Too long, >100 characters";
        }
        return null;
    } else {
        return "No value provided";
    }
}

function validateReason(reason) {
    if (typeof reason !== "undefined" && reason) {
        if (reason.length > 1000) {
            return "Too long, >1000 characters";
        }
        return null;
    } else {
        return "No value provided";
    }
}

module.exports = {
    validateDescription,
    validateSummary,
    validateCategory,
    validateID,
    validateActive,
    convertToBoolean,
    validateColor,
    validatePartyName,
    validateIcon,
    validateShortName,
    validateReason,
    validateData,
};
