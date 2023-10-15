import mongoose from "mongoose";

export async function withRetry(
    transactionFunction: (session: mongoose.ClientSession) => Promise<void>,
    session: mongoose.ClientSession,
    maxAttempts = 15,
    initialWaitTime = 200,
    backoffFactor = 2
) {
    let attempts = 0;
    let waitTime = initialWaitTime;

    while (attempts < maxAttempts) {
        try {
            attempts++;
            await transactionFunction(session);
            break;
        } catch (error) {
            console.error("Transaction failed:", error);

            // Handle your error logic here
            if (attempts >= maxAttempts) {
                throw new Error(
                    "Transaction failed after maximum number of retries"
                );
            }

            // Optionally wait for a short period before retrying
            await new Promise((resolve) => setTimeout(resolve, waitTime));

            // Increase wait time for next retry
            waitTime *= backoffFactor;
        }
    }
}
