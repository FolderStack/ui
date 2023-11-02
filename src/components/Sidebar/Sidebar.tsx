import { Node } from "@/utils/buildTree";
import Image from "next/image";
import Link from "next/link";
import { SidebarExpander } from "./SidebarExpander";
import { SidebarMenu } from "./SidebarMenu";

export function Sidebar({ tree = [] as Node[] }) {
    return (
        <SidebarExpander>
            <div className="p-6 bg-primary-400 text-white flex flex-col space-y-8 min-h-screen h-100 w-full shadow-md z-50">
                <div className="h-16 w-full flex items-center justify-start">
                    <Link href="/folder">
                        <Image
                            src="/logo.png"
                            alt="company logo"
                            width={260}
                            height={220}
                            objectFit="contain"
                            unoptimized
                        />
                    </Link>
                </div>
                <div>
                    <SidebarMenu tree={tree} />
                </div>
            </div>
        </SidebarExpander>
    );
}
