import axios from "axios";

export const createAPIClient = (getAccessTokenSilently) => {
    const client = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}`,
        headers: {
            "Content-Type": "application/json",
        },
    });

    client.interceptors.request.use(async (config) => {
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
    
    return new APIClientWrapper(client);
}


class APIClientWrapper {
    constructor(axiosClient) {
        this.client = axiosClient;
    }

    getQuestions() {
        return this.client.get("/questions").then((resp) => resp.data);
    }

    addQuestion(description, summary, categoryID, active) {
        return this.client.post("/questions, {
            Description: description,
            Summary: summary,
            CategoryID: categoryID,
            active: active
        }
    }

    updateQuestion(id, description, summary, categoryID, active) {
        return this.client.put("/questions, {
            IssueID: id,
            Description: description,
            Summary: summary,
            CategoryID: categoryID,
            active: active
        }
    }

    deleteQuestion(id) {
        return this.client.delete(`/questions/${id}`);
    }


    getCategories() {
        return this.client.get("/categories").then((resp) => resp.data);
    }

    addCategory(name) {
        return this.client.post("/categories", {
            Name: name
        }
    }

    updateCategory(id, name) {
        return this.client.put("/categories", {
            Name: name,
            CategoryID: id
        }
    }

    deleteCategory(id) {
        return this.client.delete(`/categories/${id}`);
    }

    getParties() {
        return this.client.get("/parties").then((resp) => resp.data);
    }

    addParty(name, shortName, icon, partyColor, active) {
        return this.client.post("/parties", {
            Name: name,
            ShortName: shortName,
            Icon: icon,
            PartyColor: partyColor,
            Active: active
        }
    }

    updateParty(id, name, shortName, icon, partyColor, active) {
        return this.client.put("/parties", {
            PartyID: id,
            Name: name,
            ShortName: shortName,
            Icon: icon,
            PartyColor: partyColor,
            Active: active
        }
    }

    deleteParty(id) {
        return this.client.delete(`/parties/${id}`);
    }

    getStances() {
        return this.client.get("/stances").then((resp) => resp.data);
    }

    addStance(stand, reason, issueID, partyID) {
        return this.client.post("/stances", {
            Stand: stand,
            Reason: reason,
            IssueID: issueID,
            PartyID: partyID
        }
    }

    updateStance(id, stand, reason, issueID, partyID) {
        return this.client.put("/stances", {
            StanceID: id,
            Stand: stand,
            Reason: reason,
            IssueID: issueID,
            PartyID: partyID
        }
    }

    deleteStance(id) {
        return this.client.delete(`/stances/${id}`);
    }
}
