export interface ActionResponse {
    status: 'success' | 'error';
    message: string;

    [key: string]: any;
}