const createStore = () => {
    let data: any | null = null;

    const setData = (next: any) => {
        console.log("setData", next);
        data = next;
    };

    const getData = () => {
        return data;
    };

    return { setData, getData };
};

export const store = createStore();
