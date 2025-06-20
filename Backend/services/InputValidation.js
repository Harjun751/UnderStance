function validateDescription(desc) {
    if (typeof desc !== undefined && desc) {
        return desc.length <= 300;
    } else {
        return false;
    }
}

function validateSummary(summary) {
    if (typeof summary !== undefined && summary) {
        return summary.length <= 50;
    } else {
        return false;
    }
}

function validateCategory(category) {
    if (typeof category !== undefined && category) {
        return category.length <= 50;
    } else {
        return false;
    }
}

function validateIssueID(id) {
    if (typeof id !== undefined && id && !Number.isNaN(Number(id))) {
        return true;
    }
    return false;
}

module.exports = {
    validateDescription,
    validateSummary,
    validateCategory,
    validateIssueID
}
