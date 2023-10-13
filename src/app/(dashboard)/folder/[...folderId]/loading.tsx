import { FolderPageContentLoading } from "./components/loading/FolderPageContentLoading";
import { PaginationActionsLoading } from "./components/loading/PaginationActionsLoading";
import { QueryActionsLoading } from "./components/loading/QueryActionsLoading";

export default function FolderLoading() {
    return (
        <main className="w-full p-6">
            <section id="query-actions" className="w-full space-y-8">
                <QueryActionsLoading />
                <div className="w-full flex flex-row justify-between">
                    <PaginationActionsLoading />
                </div>
            </section>
            <div className="h-8" />
            <section id="folder-contents">
                <FolderPageContentLoading />
            </section>
        </main>
    );
}
