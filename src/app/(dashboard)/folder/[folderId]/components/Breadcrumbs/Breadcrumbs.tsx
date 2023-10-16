import { Node } from "@/utils/buildTree";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";
import { buildBreadcrumbs } from "./utils";

interface BreadcrumbProps {
    tree: Node[];
}

export function Breadcrumbs({ tree = [] }: BreadcrumbProps) {
    const { folderId } = useParams();

    // Finding the breadcrumb path
    const breadcrumbPath = buildBreadcrumbs(tree, String(folderId)) ?? [];

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
