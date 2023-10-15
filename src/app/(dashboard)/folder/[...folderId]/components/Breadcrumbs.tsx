"use server";

import { authOptions } from "@/services/auth";
import { getFolderTree } from "@/services/db/queries/getFolderTree";
import { PageParamProps } from "@/types/params";
import { store } from "@/utils/store";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export async function Breadcrumbs() {
    const pageParams = store.getData() as PageParamProps;

    const session = await getServerSession(authOptions);
    const orgId = session?.user?.orgId;
    if (!orgId) return null;

    const folderTree = await getFolderTree(orgId);
    const folderId = pageParams.params.folderId[0];

    console.log(folderTree, folderId);

    function findBreadcrumb(
        tree: any[],
        targetId: string,
        path: any[] = []
    ): any[] {
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.id === targetId) {
                path.push({
                    id: node.id,
                    name: node.name,
                    path: "/folder/" + node.id,
                });
                return path;
            }
            if (node.tree && node.tree.length > 0) {
                const newPath = findBreadcrumb(node.tree, targetId, [
                    ...path,
                    {
                        id: node.id,
                        name: node.name,
                        path: "/folder/" + node.id,
                    },
                ]);
                if (newPath.length > 0) {
                    return newPath;
                }
            }
        }
        return [];
    }

    // Finding the breadcrumb path
    const breadcrumbPath = findBreadcrumb(folderTree, folderId);

    // Add the root ('/') to the breadcrumb
    breadcrumbPath.unshift({ id: null, name: "Home", path: "/" });

    return (
        <div className="flex flex-row -mt-2 mb-2 text-sm font-medium items-center">
            {breadcrumbPath.map((crumb, index) => (
                <div key={index} className="flex flex-row items-center">
                    <Link href={crumb.path} className="hover:underline">
                        {crumb.name}
                    </Link>
                    {index !== breadcrumbPath.length - 1 && (
                        <span className="mt-0.5">
                            <FiChevronRight size={18} />
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
