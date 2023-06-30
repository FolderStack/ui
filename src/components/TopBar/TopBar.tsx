import { ActionBar } from "../ActionBar";
import { FilterBar } from "../FilterBar";
import { FolderActions } from "../FolderActions";
import { SearchBar } from "../SearchBar";
import { SelectActions } from "../SelectActions";

export function TopBar() {
    return (
        <>
            <SearchBar />
            <ActionBar />
            <FilterBar />
            <FolderActions />
            <SelectActions />
        </>
    );
}
