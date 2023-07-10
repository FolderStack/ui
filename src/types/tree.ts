export interface BasicTree {
    id: string;
    children: Array<BasicTree & { name: string }>;
}
