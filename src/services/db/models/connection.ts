// connector.model.ts
import mongoose, { Document } from "mongoose";

export interface IConnector extends Document {
    key: string;
    orgId: string;
    userId: string;
    service: string;
    connectionId: string;
    clientConfiguration: any;
}

const ConnectorSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    orgId: { type: String, required: true },
    userId: { type: String, required: true },
    service: { type: String, required: true },
    connectionId: { type: String, required: true },
    clientConfiguration: Object,
});

let ConnectorModel: mongoose.Model<IConnector>;
try {
    ConnectorModel = mongoose.model<IConnector>("Connector");
} catch (error) {
    ConnectorModel = mongoose.model<IConnector>("Connector", ConnectorSchema);
}

export { ConnectorModel };
