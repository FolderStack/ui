import { authOptions } from "@/services/auth";
import { getFolder } from "@/services/db/queries/getFolder";
import { getFolderContents } from "@/services/db/queries/getFolderContents";
import { PageParamProps } from "@/types/params";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: PageParamProps) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const orgId = session?.user?.orgId;

    if (!orgId || !userId) {
        return new NextResponse(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }

    let { folderId } = params;
    if (folderId instanceof Array) {
        folderId = folderId[0] ?? null;
    }

    if (!folderId) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "No folder ID provided",
            }),
            { status: 400 }
        );
    }

    try {
        // Get page data...
        const searchParams = new URL(req.url).searchParams;

        const [page, data] = await Promise.all([
            getFolder({ params, searchParams }),
            getFolderContents({ params, searchParams }),
        ]);

        return new NextResponse(JSON.stringify({ success: true, page, data }), {
            status: 200,
        });
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
};
