export function FolderPageContentLoading() {
    return (
        <div
            className="grid gap-4"
            style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
        >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                const textWidth = Math.random() * 50 + 50; // min 50, max 100
                return (
                    <div
                        key={i}
                        className="rounded animate-pulse bg-gray-200 h-72 p-4 space-y-4"
                    >
                        <div className="rounded animate-pulse bg-gray-300 h-48 w-full relative" />
                        <div
                            className="rounded animate-pulse bg-gray-300 h-6 relative"
                            style={{ width: `${textWidth}%` }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
