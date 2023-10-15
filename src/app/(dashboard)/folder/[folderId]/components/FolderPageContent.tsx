import { File } from "./Items/File";
import { Folder } from "./Items/Folder";

interface FolderPageContentProps {
    items: any[];
}

export function FolderPageContent({ items = [] }: FolderPageContentProps) {
    return (
        <div
            className="grid gap-4"
            style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
        >
            {items.map((item) => {
                if (item.type === "folder") {
                    return <Folder key={item.id} {...item} />;
                }
                return <File key={item.id} {...item} />;
            })}
        </div>
    );
}
