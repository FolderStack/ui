"use client";
import { useContext } from "react";
import { FileUpload } from "./FileUpload";

export function useUpload() {
    return useContext(FileUpload);
}
