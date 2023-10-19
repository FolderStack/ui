import { DynamicConnectorManager } from "./manager";

export class ConnectionFetcher {
    constructor(public readonly orgId: string, public readonly userId: string) {
        // nothing to see here
    }

    async getAllTrees(): Promise<any[]> {
        const manager = new DynamicConnectorManager(); // Assume it's pre-populated or singleton
        const userConnectors = await manager.getAllUserConnections(
            this.orgId,
            this.userId
        );

        const allTrees = await Promise.all(
            userConnectors.map((connector) => connector.tree())
        );

        return allTrees;
    }
}
