export function SidebarLoading() {
    return (
        <aside style={{ width: "320px" }} className={"h-full"}>
            <div className="p-6 bg-primary-400 text-white flex flex-col space-y-8 h-full w-full">
                <div className="h-24 w-full flex items-center justify-center animate-pulse bg-gray-200" />
                <div className="h-full">
                    <div className="flex flex-col select-none w-full h-full">
                        <div className="w-full h-10 my-1 rounded-sm flex justify-between items-center py-1">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex justify-between items-center py-1">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex flex-row justify-end items-center py-1">
                            <div className="w-[80%] animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex flex-row justify-end items-center py-1">
                            <div className="w-[60%] animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex justify-between items-center py-1">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex flex-row justify-end items-center py-1">
                            <div className="w-[75%] animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex justify-between items-center py-1">
                            <div className="w-full animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex flex-row justify-end items-center py-1">
                            <div className="w-[80%] animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex flex-row justify-end items-center py-1">
                            <div className="w-[60%] animate-pulse h-full bg-gray-200" />
                        </div>
                        <div className="w-full h-10 my-1 rounded-sm flex flex-row justify-end items-center py-1">
                            <div className="w-[40%] animate-pulse h-full bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
