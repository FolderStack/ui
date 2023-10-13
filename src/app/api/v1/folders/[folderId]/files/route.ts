import md5 from "md5";
import fs from 'fs';
import { s3Client } from "@/services/aws/s3";
import { FileModel } from "@/services/db/models";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { formidable } from 'formidable';
import { authOptions } from "@/services/auth";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.orgId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { folderId } = req.query;
    if (!folderId) {
        return res.status(400).json({ success: false, message: 'No folder ID provided.' });
    }

    const form = formidable();

    try {
        const [_, files] = await form.parse<string, 'file'>(req);
        const filesArray = files.file;

        if (!filesArray || filesArray.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded.' });
        }

        const savedFiles = [];
        for (const file of filesArray) {
            const name = file.originalFilename || file.newFilename;
            const buffer = await fs.promises.readFile(file.filepath);
            const mimeType = (file as any).type ?? 'application/octetstream';
            const fileSize = file.size;

            const putObject = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${folderId}/${md5(name)}`,
                Body: buffer,
            };

            const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${putObject.Key}`;

            await s3Client.send(new PutObjectCommand(putObject));

            const newFile = new FileModel({
                name,
                fileSize,
                mimeType,
                folderId,
                s3Key: putObject.Key,
                s3Url,
                createdBy: session.user.id,
            });

            const savedFile = await newFile.save();
            savedFiles.push(savedFile);
        }

        return res.status(201).json({ success: true, files: savedFiles });

    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
};