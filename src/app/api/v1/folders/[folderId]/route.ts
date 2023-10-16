import { authOptions } from "@/services/auth";
import { getFolder } from "@/services/db/queries/getFolder";
import { PageParamProps } from "@/types/params";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: Pick<PageParamProps, "params">
) => {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams);
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
        const page = await getFolder({ params, searchParams });

        return new NextResponse(
            JSON.stringify({ success: true, ...(page ?? {}) }),
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
