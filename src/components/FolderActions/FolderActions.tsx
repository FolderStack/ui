"use client";
import { Row } from "../Elements";
import { AdminActions } from "./AdminActions";
import { PaginationActions } from "./PaginationActions";

export function FolderActions() {
    return (
        <Row style={BarStyle} align="middle" justify="space-between">
            {/** These are admin-only operations  */}
            <Row style={SubRow} align="middle">
                <AdminActions />
            </Row>

            {/** These are user operations */}
            <Row style={SubRow} align="middle">
                <PaginationActions />
            </Row>
        </Row>
    );
}

const BarStyle = {
    height: "48px",
    width: "100%",
    borderRadius: "4px",
    marginBottom: "24px",
};

const SubRow = {
    gap: "8px",
};
