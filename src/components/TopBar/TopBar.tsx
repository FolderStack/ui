import React from "react";
import { ActionBar } from "../ActionBar";
import { FilterBar } from "../FilterBar";
import { FolderActions } from "../FolderActions";
import { SelectActions } from "../SelectActions";

function TopBarComponent() {
    return (
        <>
            {/* <SearchBar /> */}
            <ActionBar />
            <FilterBar />
            <FolderActions />
            <SelectActions />
        </>
    );
}

export const TopBar = React.memo(TopBarComponent);
