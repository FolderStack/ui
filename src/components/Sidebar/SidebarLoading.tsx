export function SidebarLoading() {
    return (
        <aside style={{ width: "320px" }} className={"h-full"}>
            <div className="p-6 bg-gray-300 text-white flex flex-col space-y-8 h-full w-full">
                <div className="h-16 w-full flex items-center justify-center animate-pulse bg-gray-200" />
                <div>
                    <div className="flex flex-col select-none w-full">
                        <div className="my-1 rounded-sm flex flex-1 justify-between items-center cursor-pointer py-1 px-3">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="my-1 rounded-sm flex justify-between items-center cursor-pointer py-1 px-3">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="my-1 rounded-sm flex justify-between items-center cursor-pointer py-1 px-3">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="my-1 rounded-sm flex justify-between items-center cursor-pointer py-1 px-3">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="my-1 rounded-sm flex justify-between items-center cursor-pointer py-1 px-3">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
