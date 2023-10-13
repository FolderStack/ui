import mongoose, { Schema } from "mongoose";

export interface IOrganisation extends Document {
    name: string;
    id: string;
}

// Organisation Schema
const OrganisationSchema = new Schema<IOrganisation>({
    name: { type: String, required: true },
    id: { type: String, required: true },
});

let OrganisationModel: mongoose.Model<IOrganisation>;
try {
    OrganisationModel = mongoose.model<IOrganisation>('Organisation')
} catch (error) {
    OrganisationModel = mongoose.model<IOrganisation>('Organisation', OrganisationSchema)
}

export { OrganisationModel }