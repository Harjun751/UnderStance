const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const secrets = require("./secrets");

let analyticsDataClient;

function initAnalyticsClient() {
    if (!analyticsDataClient) {
        try {
            const serviceAccountRaw = secrets.getGa4ServiceAcc();
            if (serviceAccountRaw === null) {
                throw new Error("GA4_SERVICE_ACCOUNT_JSON is not defined");
            }

            const serviceAccount = JSON.parse(serviceAccountRaw);
            analyticsDataClient = new BetaAnalyticsDataClient({
                credentials: serviceAccount,
            });
        } catch (err) {
            console.error("Failed to init GA4 client:", err.message);
            throw err;
        }
    }
}

async function getAnalyticsReport() {
    initAnalyticsClient();

    const propertyId = secrets.getGa4PropID();
    if (!propertyId) {
        throw new Error("GA4_PROPERTY_ID is undefined");
    }

    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [
                { name: "activeUsers" },
                { name: "newUsers" },
                { name: "sessions" },
                { name: "screenPageViews" }
            ],
            dimensions: [
                { name: "date" }
            ]
        });

        const metricHeaders = response.metricHeaders.map(h => h.name);
        const dimensionHeaders = response.dimensionHeaders.map(h => h.name);

        const results = response.rows.map(row => {
            const rowData = {};

            // Add dimension values
            row.dimensionValues.forEach((val, idx) => {
                rowData[dimensionHeaders[idx]] = val.value;
            });

            // Add metric values
            row.metricValues.forEach((val, idx) => {
                rowData[metricHeaders[idx]] = val.value;
            });

            return rowData;
        });

        console.log("GA4 Full Report:", JSON.stringify(results, null, 2));

        return results;
    } catch (err) {
        console.error("GA4 runReport failed:", err.message);
        throw err;
    }
}

module.exports = {
    getAnalyticsReport,
};
