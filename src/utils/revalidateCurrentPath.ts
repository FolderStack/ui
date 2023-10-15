import { revalidatePath } from "next/cache";

export function revalidateCurrentPath() {
    const url = new URL(window.location.href);

    revalidatePath(url.pathname);
}
