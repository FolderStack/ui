import mongoose from "mongoose";

export async function mongoConnect() {
    try {
        const url = process.env.MONGODB_URL!;
        return mongoose.connect(url, { dbName: 'folderstack_dev' });
    } catch (err) {
        return null;
    }
}