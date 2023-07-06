export interface Tree {
    id: string;
    children: Array<Tree & { name: string }>;
}
