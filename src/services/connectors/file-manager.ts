import { pipeline } from "stream";
import { promisify } from "util";
import { DynamicConnectorManager } from "./manager";
const pipelineAsync = promisify(pipeline);

interface CrossConnectorPayload {
    src: {
        connector: string;
        path: string;
    };
    dest: {
        connector: string;
        path: string;
    };
}

export class FileManager {
    constructor(
        public readonly dynamicConnectorManager: DynamicConnectorManager
    ) {
        // nothing to see here...
    }

    async copyFileStream(
        orgId: string,
        userId: string,
        payload: CrossConnectorPayload
    ) {
        const srcConnector =
            await this.dynamicConnectorManager.getUserConnectorByKey(
                orgId,
                userId,
                payload.src.connector
            );
        const destConnector =
            await this.dynamicConnectorManager.getUserConnectorByKey(
                orgId,
                userId,
                payload.dest.connector
            );

        if (!srcConnector || !destConnector) {
            throw new Error("Invalid source or destination connector");
        }

        const readStream = srcConnector.createReadStream(payload.src.path);
        const writeStream = destConnector.createWriteStream(payload.dest.path);

        await pipelineAsync(readStream, writeStream);
    }

    async moveFileStream(
        orgId: string,
        userId: string,
        payload: CrossConnectorPayload
    ) {
        await this.copyFileStream(orgId, userId, payload);
        const srcConnector =
            await this.dynamicConnectorManager.getUserConnectorByKey(
                orgId,
                userId,
                payload.src.connector
            );

        if (srcConnector) {
            await srcConnector.delete(payload.src.path);
        } else {
            throw new Error("Failed to delete from source.");
        }
    }

    async getAccessibleFilesAndThumbnails(
        orgId: string,
        userId: string,
        fileIds: string[],
        connectionKey: string,
        connectorManager: DynamicConnectorManager
    ) {
        const connector = await connectorManager.getUserConnectorByKey(
            orgId,
            userId,
            connectionKey
        );

        if (!connector) return;

        const accessibleFileIds = await connector.checkBulkPermission(
            userId,
            fileIds
        );
        const thumbnailMap = await connector.getBulkThumbnails(
            accessibleFileIds
        );

        const accessibleFilesWithThumbnails = accessibleFileIds.map((id) => ({
            id,
            thumbnail: thumbnailMap.get(id),
        }));

        return accessibleFilesWithThumbnails;
    }
}
