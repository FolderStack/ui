import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { IOrganisation, OrganisationModel } from "../models";
import { mongoConnect } from "../mongodb";

export async function getOrganisation(orgId: string) {
    const pipeline = [{ $match: { _id: toObjectId(orgId) } }];

    await mongoConnect();
    const [org] = await OrganisationModel.aggregate(pipeline).exec();
    if (org) {
        return removeObjectIds<IOrganisation>(org);
    }

    return null;
}
