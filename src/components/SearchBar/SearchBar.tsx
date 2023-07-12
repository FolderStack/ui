"use client";
import { Form, Input } from "antd";
import { useState } from "react";
import { AdvancedSearch } from "./AdvancedSearchButton";
import { SearchButton } from "./SearchButton";
import "./search.css";

export function SearchBar() {
    const [search, setSearch] = useState<string>();

    function submitSearch() {
        //
    }

    return (
        <Form.Item className="search-bar">
            <Input
                size="large"
                value={search}
                placeholder="Search..."
                style={{ maxWidth: "360px" }}
                onChange={(evt) => setSearch(evt.target.value)}
                prefix={<SearchButton search={submitSearch} />}
                suffix={<AdvancedSearch />}
            />
        </Form.Item>
    );
}
