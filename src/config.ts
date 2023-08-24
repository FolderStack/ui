const env = String(
    process.env.VERCEL_ENV ?? process.env.NODE_ENV
).toLowerCase();

function getEnv(): "dev" | "staging" | "prod" {
    switch (env) {
        case "development":
        case "dev":
        case "local":
            return "dev";
        case "staging":
            return "staging";
        default:
            return "prod";
    }
}

function getApiUrl() {
    switch (getEnv()) {
        case "prod":
            return "https://api.folderstack.io/v1";
        case "staging":
            return "https://staging-api.folderstack.io/v1";
        case "dev":
            return "http://localhost:4000";
        default:
            throw new Error("Bad environment configuration.");
    }
}

function getHeaders() {
    switch (getEnv()) {
        case "dev":
            return {
                "X-Test-Authorizer":
                    '{"orgId": "034b110d-f7d2-47c6-b90e-81a0062b04a0"}',
            };
        default:
            return {};
    }
}

export const config = {
    env: getEnv(),
    api: {
        baseUrl: getApiUrl(),
        headers: getHeaders(),
    },
};
