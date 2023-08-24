const env = String(
    process.env.VERCEL_ENV ?? process.env.NODE_ENV
).toLowerCase();

function getApiUrl() {
    switch (env) {
        case "production":
        case "prod":
            return "https://api.folderstack.io/v1";
        case "staging":
            return "https://staging-api.folderstack.io/v1";
        case "development":
        case "dev":
        case "local":
            return "http://localhost:4000";
        default:
            throw new Error("Bad environment configuration.");
    }
}

function getHeaders() {
    switch (env) {
        case "development":
        case "dev":
        case "local":
            return {
                "X-Test-Authorizer":
                    '{"orgId": "034b110d-f7d2-47c6-b90e-81a0062b04a0"}',
            };
        default:
            return {};
    }
}

export const config = {
    api: {
        baseUrl: getApiUrl(),
        headers: getHeaders(),
    },
};
