const homePath = { id: null, name: "Home", path: "/folder" };

export function buildBreadcrumbs(
    tree: any[],
    targetId: string | null,
    path: any[] = [homePath]
): any[] | null {
    if (targetId === null) {
        return [homePath];
    }

    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.id === targetId) {
            const newPath = [
                ...path,
                {
                    id: node.id,
                    name: node.name,
                    path: "/folder/" + node.id,
                },
            ];
            return newPath;
        }

        if (node.tree && node.tree.length > 0) {
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
                return result;
            }
        }
    }

    return null;
}
