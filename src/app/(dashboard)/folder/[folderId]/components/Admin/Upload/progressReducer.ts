export interface ProgressState {
    progress: number | null;
    file: File;
    confirmed?: boolean;
}

export interface ProgressError {
    progress: -1;
    error: string;
    file: File;
    confirmed?: boolean;
}

export function progressReducer(
    state: (ProgressState | ProgressError)[],
    action: ((ProgressState | ProgressError) & { index: number }) | "clear"
) {
    if (action === "clear") return [];

    const newState = [...state];
    const { index, ...value } = action;

    const actionExists = newState[index];

    if (
        actionExists &&
        actionExists.progress === -1 &&
        !action.confirmed &&
        value.file === actionExists.file
    ) {
        // Ignore late changes to the state after an error occurs.
        return newState;
    }

    if (value.progress === null) {
        newState.splice(index, 1);
        return newState;
    }

    if (state.length - 1 < index) {
        newState.push(value);
    } else {
        newState[action.index] = value;
    }

    return newState;
}
