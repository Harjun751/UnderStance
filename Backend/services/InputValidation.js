function validateDescription(desc) {
    if (typeof desc !== "undefined" && desc) {
        return desc.length <= 300;
    } else {
        return false;
    }
}

function validateSummary(summary) {
    if (typeof summary !== "undefined" && summary) {
        return summary.length <= 50;
    } else {
        return false;
    }
}

function validateCategory(category) {
    if (typeof category !== "undefined" && category) {
        return category.length <= 50;
    } else {
        return false;
    }
}

function validateID(id) {
    if (typeof id !== "undefined" && id && !Number.isNaN(Number(id))) {
        return true;
    }
    return false;
}

function validateActive(active) {
    if (typeof active !== "undefined" && active !== null) {
        if (typeof active === "boolean") { return true; }
        return active.toLowerCase() === 'true' || active.toLowerCase() === 'false';
    }
    return false;
}

function convertToBoolean(active) {
    // assume input is clean
    if (typeof active === "boolean") { return active; }
    return active.toLowerCase() === 'true';
}

function validateShortName(name) {
    if (typeof name !== "undefined" && name) {
        return name.length <= 5;
    } else {
        return false;
    }
}

async function validateIcon(icon) {
    if (typeof icon !== "undefined" && icon) {
        if (icon.length > 2083) { return false; }
        // Check that provided URL leads to a proper image resource
        // do this by doing a fetch and read metadata
        let response;
        try {
            response = await fetch(icon, { method: 'HEAD' });
        } catch (err) {
            return false;
        }
        if (!response.ok) { return false; }
        const contentType = response.headers.get('content-type');
        // check that content type is an image type
        return contentType && contentType.startsWith('image/');
    } else {
        return false;
    }
}

function validateColor(color) {
    if (typeof color !== "undefined" && color && color.length <= 7) {
        // test if the provided value is a # followed by 3-6 letters/digits using regex
        const hexColorRegex = /^#([A-Fa-f0-9]{3,6})$/;
        return hexColorRegex.test(color);
    } else { 
        return false;
    }

}


function validatePartyName(name) {
    if (typeof name !== "undefined" && name) {
        return name.length <= 100;
    } else {
        return false;
    }
}

function validateReason(reason) {
    if (typeof reason !== "undefined" && reason) {
        return reason.length <= 1000;
    } else {
        return false;
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
    validateReason
}
