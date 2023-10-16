import { Node } from "@/utils/buildTree";
import { SidebarExpander } from "./SidebarExpander";
import { SidebarMenu } from "./SidebarMenu";

export function Sidebar({ tree = [] as Node[] }) {
    return (
        <SidebarExpander>
            <div className="p-6 bg-secondary-400 text-white flex flex-col space-y-8 h-full w-full">
                <div className="h-16 w-full flex items-center justify-center">
                    <div>Logo</div>
                </div>
                <div>
                    <SidebarMenu tree={tree} />
                </div>
            </div>
        </SidebarExpander>
    );
}
