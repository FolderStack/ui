import Image from "next/image";

export function File({ ...item }: any) {
    return (
        <div className="rounded bg-gray-200 h-72 p-4 space-y-4">
            <div className="rounded h-48 w-full relative">
                <Image
                    src={
                        "https://via.placeholder.com/300x300.png?text=Missing+Thumbail"
                    }
                    width={"100"}
                    height={"100"}
                    alt="image"
                />
            </div>
            <div>{item.name}</div>
        </div>
    );
}
