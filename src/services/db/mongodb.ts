import mongoose from "mongoose";

let connection: typeof mongoose | null = null;

/**
 * The connection is remembered and so this is safe to call multiple times.
 */
export async function mongoConnect() {
    try {
        if (connection !== null) return connection;
        const url = process.env.MONGODB_URL!;
        connection = await mongoose.connect(url, { dbName: "folderstack_dev" });
        return connection;
    } catch (err) {
        console.error(err);
        connection = null;
        return null;
    }
}
