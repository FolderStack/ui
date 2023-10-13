// __mocks__/formidable.ts

let mockFiles = {};

export const __setMockFiles = (newMockFiles: any) => {
    mockFiles = newMockFiles;
};

const formidable = jest.fn().mockImplementation(() => {
    return {
        parse: jest.fn().mockResolvedValue([null, mockFiles]),
    };
});

export { formidable };
