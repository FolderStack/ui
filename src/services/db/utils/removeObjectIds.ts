import mongoose from "mongoose";

type PlainObject = Record<string, any>;
type MongooseId = mongoose.Types.ObjectId;

type Sanitized<T> = {
    [K in keyof T]: T[K] extends MongooseId
        ? string
        : T[K] extends PlainObject
        ? Sanitized<T[K]>
        : T[K] extends (infer R)[]
        ? Sanitized<R>[]
        : T[K];
};

export function removeObjectIds<T>(obj: T): Sanitized<T> {
    if (Array.isArray(obj)) {
        return obj.map(removeObjectIds).filter((val) => {
            if (typeof val === "object" && val !== null) {
                return Object.keys(val).length > 0;
            }
            return true;
        }) as unknown as Sanitized<T>;
    }

    if (typeof obj === "object" && obj !== null) {
        const sanitized: PlainObject = {};
        for (let key in obj) {
            const value = obj[key as keyof T];
            if (key === "_id") {
                key = "id" as any;
            }

            if (typeof value === "function") {
                continue;
            } else if (value instanceof Date) {
                sanitized[key] = value.toISOString();
            } else if (value instanceof Array) {
                sanitized[key] = removeObjectIds(value);
            } else if (typeof value === "object" && value !== null) {
                if (value instanceof mongoose.mongo.ObjectId) {
                    sanitized[key] = value.toString();
                } else {
                    sanitized[key] = removeObjectIds(value);
                }
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized as Sanitized<T>;
    }
    return obj as Sanitized<T>;
}
