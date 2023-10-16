import { authOptions } from "@/services/auth";
import { getFolderTree } from "@/services/db/queries/getFolderTree";
import { Node, buildTree } from "@/utils/buildTree";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const orgId = session?.user?.orgId;

    if (!orgId || !userId) {
        return new NextResponse(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }

    try {
        const tree = await getFolderTree(orgId);
        const folderTree = buildTree(tree as Node[]);

        return new NextResponse(
            JSON.stringify({ success: true, tree: folderTree }),
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
};
