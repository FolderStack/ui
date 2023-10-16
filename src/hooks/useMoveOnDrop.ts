import { moveItems } from "@/services/db/commands/moveItems";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useSWRConfig } from "swr";

export function useMoveOnDrop(target: string) {
    const { mutate } = useSWRConfig();
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    function onDrop(ids: string[]) {
        startTransition(async () => {
            if (ids.includes(target)) return;
            await moveItems(ids, String(target));

            mutate(`/api/v1/tree`);
            mutate(`/api/v1/folders/${target}`);
            mutate(`/api/v1/folders/${target}/contents`);
            router.refresh();
        });
    }

    return { onDrop, pending };
}
