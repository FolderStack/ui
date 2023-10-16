import { authOptions } from "@/services/auth";
import { getFolderTree } from "@/services/db/queries/getFolderTree";
import { PageParamProps } from "@/types/params";
import { Node, buildTree } from "@/utils/buildTree";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { SidebarExpander } from "./SidebarExpander";
import { SidebarLoading } from "./SidebarLoading";
import { SidebarMenu } from "./SidebarMenu";

async function SidebarComponent({ params }: PageParamProps) {
    const session = await getServerSession(authOptions);
    const orgId = session?.user?.orgId;

    // Used to display the tree-like structure of folders
    const flatFolderTree = orgId ? await getFolderTree(orgId) : [];
    const folderTree = buildTree(flatFolderTree as Node[]);

    // Useful for knowing the current open folder
    const folderId = params.folderId ?? null;

    return (
        <SidebarExpander>
            <div className="p-6 bg-secondary-400 text-white flex flex-col space-y-8 h-full w-full">
                <div className="h-16 w-full flex items-center justify-center">
                    <div>Logo</div>
                </div>
                <div>
                    <SidebarMenu tree={folderTree} current={folderId} />
                </div>
            </div>
        </SidebarExpander>
    );
}

export function Sidebar(props: PageParamProps) {
    return (
        <Suspense fallback={<SidebarLoading />}>
            <SidebarComponent {...props} />
        </Suspense>
    );
}
