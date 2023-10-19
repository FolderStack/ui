export async function downloadSelected(selection: string[]) {
    const selectionStr = encodeURIComponent(selection.join(","));

    const response = await fetch(`/api/v1/download?selection=${selectionStr}`);

    if (!response.ok) {
        console.error("Fetch failed:", response.status, response.statusText);
        return;
    }

    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "download.zip"; // Default name

    console.log(contentDisposition);
    // Extract filename from Content-Disposition header if available
    if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?\b/);
        if (match && match[1]) filename = match[1];
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
}
