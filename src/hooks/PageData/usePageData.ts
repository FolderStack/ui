import { useContext } from "react";
import { PageDataContext } from "./PageDataContext";

export function usePageData() {
    return useContext(PageDataContext);
}
