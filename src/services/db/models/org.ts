import mongoose, { Document, Schema } from "mongoose";

export interface IOrganisation extends Document {
    name: string;
    id: string;
}

// Folder Schema
const OrganisationSchema = new Schema<IOrganisation>({
    name: { type: String, required: true },
    id: { type: String, required: true },
});

export const OrganisationModel = mongoose.model<IOrganisation>(
    "Organisation",
    OrganisationSchema
);
