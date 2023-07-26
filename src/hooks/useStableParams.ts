import { useParams } from "next/navigation";
import { useMemo } from "react";

export function useStableParams() {
    const params = useParams();

    return useMemo(
        () => params,
        /**
         * This is pretty dodgy... but it allows the following to happen
         * and somehow work.
         *
         * Assume you've not opened a folder and you're at home or the url
         * xyz.abc.net/?sort=desc...etc (handled by the file at app/page.tsx)
         * There's no folderId in the params and so they might be empty.
         *
         * React complains when you click on a folder and navigate to it as
         * the length of the params array changes size from 0 to >= 1.
         *
         * By passing an array with an empty string we're circumventing that
         * error and letting react know we generally expect to have some
         * non-empty array.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
        Object.values(params).length ? Object.values(params) : [""]
    );
}
