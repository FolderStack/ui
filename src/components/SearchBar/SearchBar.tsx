"use client";
import { useState } from "react";

export function SearchBar() {
    const [search, setSearch] = useState<string>();

    function submitSearch() {
        //
    }

    return (
        <></>
        // <AntFormItem>
        //     <AntInput
        //         size="large"
        //         value={search}
        //         placeholder="Search everything..."
        //         style={{ maxWidth: "360px" }}
        //         onChange={(evt) => setSearch(evt.target.value)}
        //         prefix={<SearchButton search={submitSearch} />}
        //         suffix={<AdvancedSearch />}
        //     />
        // </AntFormItem>
    );
}
