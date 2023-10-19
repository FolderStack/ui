import * as AwsS3 from "@aws-sdk/client-s3";
import { FileSystemConnector, FileSystemObject } from "./base";

export class S3FileSystemConnector extends FileSystemConnector {
    private readonly s3: AwsS3.S3Client;
    private readonly bucketName: string;

    constructor(
        orgId: string,
        userId: string,
        clientConfiguration: {
            bucketName: string;
            region: string;
            credentials: AwsS3.S3ClientConfig["credentials"];
        }
    ) {
        super(orgId, userId);
        this.bucketName = clientConfiguration.bucketName;
        this.s3 = new AwsS3.S3Client({
            region: clientConfiguration.region,
            credentials: clientConfiguration.credentials,
        });
    }

    async tree(prefix = ""): Promise<FileSystemObject[]> {
        const params: AwsS3.ListObjectsV2Request = {
            Bucket: this.bucketName,
            Delimiter: "/",
            Prefix: prefix,
        };
        const data = await this.s3.send(new AwsS3.ListObjectsV2Command(params));
        const objects: FileSystemObject[] = [];

        return objects;
    }

    async getThumbnail(filePath: string): Promise<string | null> {
        return "S3_thumbnail_url";
    }

    getBulkThumbnails(
        filePaths: string[]
    ): Promise<Map<string, string | null>> {
        throw new Error("Method not implemented.");
    }
    upload(filePath: string, content: Buffer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    download(filePath: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    rename(oldPath: string, newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    move(srcPath: string, destPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(filePath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createReadStream(filePath: string): NodeJS.ReadableStream {
        throw new Error("Method not implemented.");
    }
    createWriteStream(filePath: string, meta?: any): NodeJS.WritableStream {
        throw new Error("Method not implemented.");
    }
}
