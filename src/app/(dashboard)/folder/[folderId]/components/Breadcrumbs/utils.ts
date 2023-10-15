export function buildBreadcrumbs(
    tree: any[],
    targetId: string,
    path: any[] = [{ id: null, name: "Home", path: "/" }]
): any[] | null {
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.id === targetId) {
            // Found the target, append it to the path and return.
            path.push({
                id: node.id,
                name: node.name,
                path: "/folder/" + node.id,
            });
            return path;
        }

        if (node.tree && node.tree.length > 0) {
            // If the node has children, append the node to the path and go deeper.
            const newPath = [
                ...path,
                {
                    id: node.id,
                    name: node.name,
                    path: "/folder/" + node.id,
                },
            ];
            const result = buildBreadcrumbs(node.tree, targetId, newPath);
            if (result) {
                return result; // If found in subtree, return the result.
            }
        }
    }
    return null; // If not found, return null.
}
