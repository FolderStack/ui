class Leaf<T = any> {
    constructor(public readonly value: T) {
        //
    }
}

export class Tree<T = any> {
    private nodes: Tree<T>[] = [];
    private leaves: Leaf<T>[] = [];

    constructor(private readonly parent?: Tree<T>) {}

    addLeaf(value: Leaf<T>["value"]) {
        const leaf = new Leaf(value);
        this.parent?.registerChildLeaf(leaf, this);
        this.leaves.push(leaf);
    }

    addNode(tree: Tree<T>) {
        this.parent?.registerChildNode(tree);
        this.nodes.push(tree);
    }

    getLeaves() {
        return this.leaves.map((l) => l);
    }

    protected registerChildLeaf(leaf: Leaf<T>, parent: Tree<T>) {
        if (this.parent) {
            this.parent.registerChildLeaf(leaf, parent);
        }
    }

    protected registerChildNode(node: Tree<T>) {
        if (this.parent) {
            this.parent.registerChildNode(node);
        } else {
            // this.addLeaf()
        }
    }

    getPath(value: Leaf<T>["value"]): Array<Leaf<T>["value"]> | null {
        if (this.leaves.length > 0 && this.leaves[0].value === value) {
            return [this.leaves[0].value];
        }

        for (let i = 0; i < this.nodes.length; i++) {
            const subPath = this.nodes[i].getPath(value);
            if (subPath !== null) {
                return [this.leaves[0]?.value, ...subPath].filter(
                    (v) => v !== undefined
                );
            }
        }

        return null;
    }
}
