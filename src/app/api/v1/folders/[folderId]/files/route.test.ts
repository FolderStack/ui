import { mockClient } from "aws-sdk-client-mock";
import { NextApiRequest, NextApiResponse } from 'next';
import handler from './route';
import { getServerSession } from 'next-auth';
import { FileModel } from '@/services/db/models';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { __setMockFiles } from "../../../../../../../__mocks__/formidable";

const s3Mock = mockClient(S3Client);

jest.mock('formidable')
jest.mock('next-auth');
jest.mock('@/services/db/models');
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn().mockResolvedValue(Buffer.from('some buffer'))
    },
}));

s3Mock.on(PutObjectCommand).resolves({} as never);

describe('handler', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;

    beforeEach(() => {
        req = {
            method: 'POST',
            query: { folderId: 'someFolderId' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();

        (getServerSession as jest.MockedFunction<typeof getServerSession>).mockResolvedValue({ user: { orgId: 'orgId' } });
        (FileModel.prototype.save as jest.MockedFunction<typeof FileModel.prototype.save>).mockResolvedValue({});
    });

    it('should return 405 if method is not POST', async () => {
        req.method = 'GET';
        await handler(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should return 401 if no session exists', async () => {
        (getServerSession as jest.MockedFunction<typeof getServerSession>).mockResolvedValue(null);
        await handler(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should return 400 if folderId is missing', async () => {
        req.query = {};
        await handler(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should return 400 if no uploads are provided', async () => {
        __setMockFiles({
            file: []
        });
        await handler(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));

        __setMockFiles({});
        await handler(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should return 200 on successful upload', async () => {
        __setMockFiles({
            file: [{
                newFilename: 'test',
                filepath: 'testfilepath',
                size: 1,
                type: 'pdf'
            }]
        });
        await handler(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

        // 100% coverage ples
        __setMockFiles({
            file: [{
                originalFileName: 'test',
                filepath: 'testfilepath',
                size: 1
            }]
        });
        await handler(req as NextApiRequest, res as NextApiResponse);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});
