import mongoose from "mongoose";

export function toObjectId(val: any) {
    return mongoose.mongo.ObjectId.createFromHexString(String(val));
}
