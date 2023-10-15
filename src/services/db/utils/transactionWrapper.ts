import mongoose from "mongoose";
import { withRetry } from "./withRetry";

export async function transactionWrapper(
    transactionFunction: (session: mongoose.ClientSession) => Promise<void>
) {
    const session = await mongoose.startSession();
    session.startTransaction({
        maxCommitTimeMS: 10000,
    });

    try {
        await withRetry(transactionFunction, session);

        if (!session.hasEnded) {
            await session.commitTransaction();
        }
    } catch (error: any) {
        if (!session.hasEnded) {
            await session.abortTransaction();
        }
        if (
            error[Symbol.for("errorLabels")]?.has("TransientTransactionError")
        ) {
            console.error("Reached max retries for transaction.");
            // Handle transient error by retrying the transaction.
            // Make sure you don't endlessly retry; set a max retry count.
        } else {
            // Throw or handle the error.
            throw error;
        }
    } finally {
        session.endSession();
    }
}
