import mongoose from "mongoose";

export const isValidId = (id: string): boolean =>
    mongoose.Types.ObjectId.isValid(id);
