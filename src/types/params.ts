export interface PageParamProps<T = any> {
    params: T;
    searchParams:
        | { [key: string]: string | string[] | undefined }
        | URLSearchParams;
}
