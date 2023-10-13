import mongoose from "mongoose";
import { IOrganisation, OrganisationModel } from "../models/org";

export async function getOrganisation(
    orgId: string
): Promise<IOrganisation | null> {
    const pipeline = [{ $match: { _id: new mongoose.Types.ObjectId(orgId) } }];

    const [org] = await OrganisationModel.aggregate(pipeline).exec();
    if (org) return org;

    return null;
}
