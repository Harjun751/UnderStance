export class FetchError extends Error {
    constructor(message, res) {
        super(message);
        this.details = { url: res.url, headers: res.headers, status: res.status }
    }
}
