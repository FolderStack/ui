export interface Node {
    id: string;
    name: string;
    parent: string | null;
    orgId: string;
    tree?: Node[];
    // other optional fields
    [key: string]: any;
}

export function buildTree(nodes: Node[]): Node[] {
    const idMap = new Map<string, Node>();

    // Initialize all nodes in a map.
    nodes.forEach((node) => {
        idMap.set(node.id, { ...node, tree: [] });
    });

    const rootNodes: Node[] = [];

    // Build the tree structure.
    idMap.forEach((node, id) => {
        if (node.parent === null) {
            rootNodes.push(node);
        } else {
            const parentNode = idMap.get(node.parent);
            if (parentNode) {
                parentNode.tree!.push(node);
            }
        }
    });

    return rootNodes;
}
