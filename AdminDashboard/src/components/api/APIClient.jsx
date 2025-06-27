import axios from "axios";

/*async function fetchWithCreds(url, method, data) {
    const { getAccessTokenSilently } = useAuth0();
    const token = await getAccessTokenSilently({
        authorizationParams: {
            audience: "https://understance-backend.onrender.com/",
        },
    });
    const token = "hi";

    const headers =  {
        'Authorization': `Bearer ${token}`,
        'Content-Type': "application/json"
    }
    const options = (data === null) ?
        { method: method, headers: headers }
     :  { method: method, headers: headers, body: JSON.stringify(data) }

    const res = await fetch(url, options);
    return await res.json();
}


export const getQuestions = () => {
    return fetchWithCreds(
        `${import.meta.env.VITE_API_URL}/questions`,
        "GET",
        null
    )
}

export const postQuestion = (description, summary, categoryID, active) => {
    return fetchWithCreds(
        `${import.meta.env.VITE_API_URL}/questions`,
        "POST",
        {
            Description: description,
            Summary: summary,
            categoryID: categoryID,
            active: active
        }
    )
}

export const putQuestion = (id, description, summary, categoryID, active) => {
    return fetchWithCreds(
        `${import.meta.env.VITE_API_URL}/questions`,
        "POST",
        {
            IssueID: id,
            Description: description,
            Summary: summary,
            categoryID: categoryID,
            active: active
        }
    )
}

export const deleteQuestion = (id) => {
    return fetchWithCreds(
        `${import.meta.env.VITE_API_URL}/questions/${id}`,
        "DELETE",
        null
    )
}*/

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

    getCategories() {
        return this.client.get("/categories").then((resp) => resp.data);
    }
    getParties() {
        return this.client.get("/parties").then((resp) => resp.data);
    }
    getStances() {
        return this.client.get("/stances").then((resp) => resp.data);
    }
    getQuestions() {
        return this.client.get("/questions").then((resp) => resp.data);
    }
}
