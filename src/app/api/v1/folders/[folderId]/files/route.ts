import { authOptions } from "@/services/auth";
import { createFile } from "@/services/db/commands/createFile";
import { PageParamProps } from "@/types/params";
import { extractS3Key } from "@/utils/extractS3KeyFromUrl";
import { getRequestBody } from "@/utils/getRequestBody";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: PageParamProps) => {
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
        const data = await getRequestBody(req);

        if (!data) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "No file uploaded",
                }),
                { status: 400 }
            );
        }

        const { name, type = "application/octetstream", size, url } = data;
        const key = extractS3Key(url);

        if (!key) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "Couldn't parse url",
                }),
                { status: 400 }
            );
        }

        await createFile(folderId, orgId, {
            name,
            fileSize: size,
            mimeType: type,
            s3Key: key,
            createdBy: userId,
        });

        return new NextResponse(JSON.stringify({ success: true }), {
            status: 201,
        });
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
};
