import { ConnectorModel, IConnector } from "../db/models/connection";
import { FileSystemConnector } from "./base";
import { S3FileSystemConnector } from "./s3";

export class DynamicConnectorManager {
    async addUserConnection(
        orgId: string,
        userId: string,
        service: string,
        connectionId: string,
        clientConfiguration: any
    ) {
        const key = `${orgId}-${userId}-${service}-${connectionId}`;
        const connector = this.getServiceFromConfig(
            orgId,
            userId,
            service,
            clientConfiguration
        );

        await ConnectorModel.create({
            key,
            orgId,
            userId,
            service,
            connectionId,
            clientConfiguration,
        });

        return connector;
    }

    async getUserConnector(
        orgId: string,
        userId: string,
        service: string,
        connectionId: string
    ): Promise<FileSystemConnector | null> {
        const key = `${orgId}-${userId}-${service}-${connectionId}`;
        const doc = await ConnectorModel.findOne({ key });
        if (!doc) return null;

        const connector = this.getServiceFromConfig(
            orgId,
            userId,
            doc.service,
            doc.clientConfiguration
        );

        return connector;
    }

    async getUserConnectorByKey(
        orgId: string,
        userId: string,
        key: string
    ): Promise<FileSystemConnector | null> {
        const doc = await ConnectorModel.findOne({ key });
        if (!doc) return null;

        const connector = this.getServiceFromConfig(
            orgId,
            userId,
            doc.service,
            doc.clientConfiguration
        );

        return connector;
    }

    async removeUserConnection(
        orgId: string,
        userId: string,
        service: string,
        connectionId: string
    ): Promise<void> {
        const key = `${orgId}-${userId}-${service}-${connectionId}`;
        await ConnectorModel.deleteOne({ key });
    }

    async getUserConnectorsByService(
        orgId: string,
        userId: string,
        service: string
    ): Promise<FileSystemConnector[]> {
        const pattern = `^${orgId}-${userId}-${service}-`;
        const docs = await ConnectorModel.find({ key: new RegExp(pattern) });

        return this.mapConnectorsFromConfig(orgId, userId, docs);
    }

    async getAllUserConnections(
        orgId: string,
        userId: string
    ): Promise<FileSystemConnector[]> {
        const pattern = `^${orgId}-${userId}-`;
        const docs = await ConnectorModel.find({ key: new RegExp(pattern) });

        return this.mapConnectorsFromConfig(orgId, userId, docs);
    }

    async getAllOrgConnections(orgId: string): Promise<FileSystemConnector[]> {
        const pattern = `^${orgId}-`;
        const docs = await ConnectorModel.find({ key: new RegExp(pattern) });

        return this.mapConnectorsFromConfig(orgId, null, docs);
    }

    private getServiceFromConfig(
        orgId: string,
        userId: string,
        service: string,
        clientConfiguration: any
    ) {
        let connector: FileSystemConnector;
        // Instantiate FileSystemConnector based on service
        switch (service) {
            case "s3":
                connector = new S3FileSystemConnector(
                    orgId,
                    userId,
                    clientConfiguration
                );
                break;
            // case "google":
            //     connector = new GoogleDriveFileSystemConnector(
            //         orgId,
            //         userId,
            //         clientConfiguration
            //     );
            //     break;
            // case "onedrive":
            //     connector = new OneDriveFileSystemConnector(
            //         orgId,
            //         userId,
            //         clientConfiguration
            //     );
            //     break;
            // case "dropbox":
            //     connector = new DropboxFileSystemConnector(
            //         orgId,
            //         userId,
            //         clientConfiguration
            //     );
            //     break;
            default:
                throw new Error("Unsupported service");
        }
        return connector;
    }

    private mapConnectorsFromConfig(
        orgId: string,
        userId: string | null,
        configs: IConnector[]
    ) {
        const connectors = [];
        for (const config of configs) {
            connectors.push(
                this.getServiceFromConfig(
                    orgId,
                    userId || config.userId,
                    config.service,
                    config.clientConfiguration
                )
            );
        }

        return connectors;
    }
}
