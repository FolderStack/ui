import { BiSolidFolder } from "react-icons/bi";

export function Folder({ ...item }: any) {
    return (
        <div className="rounded bg-gray-200 h-72 p-4 space-y-4">
            <div className="rounded w-full h-4/5 relative">
                <BiSolidFolder
                    style={{ width: "100%", height: "100%" }}
                    className="text-primary-500"
                />
            </div>
            <div>{item.name}</div>
        </div>
    );
}
