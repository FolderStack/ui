"use server";

import { authOptions } from "@/services/auth";
import { getFolderTree } from "@/services/db/queries/getFolderTree";
import { PageParamProps } from "@/types/params";
import { Node, buildTree } from "@/utils/buildTree";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { buildBreadcrumbs } from "./utils";

export async function Breadcrumbs({ params }: PageParamProps) {
    const session = await getServerSession(authOptions);
    const orgId = session?.user?.orgId;

    const flatFolderTree = orgId ? await getFolderTree(orgId) : [];
    const folderTree = buildTree(flatFolderTree as Node[]);
    const folderId = params.folderId ?? null;

    // Finding the breadcrumb path
    const breadcrumbPath = buildBreadcrumbs(folderTree, folderId) ?? [];

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
