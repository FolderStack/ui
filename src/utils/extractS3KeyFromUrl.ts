export function extractS3Key(url: string) {
    const regex =
        /(?:https?:\/\/)?(?:s3\.\w+-\w+-\d\.amazonaws\.com\/|[\w\-\.]+\.s3\.\w+-\w+-\d\.amazonaws\.com\/)(?:[\w\-\.]+\/)?([\w\-\.\/]+)(?:\?.*)?/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
