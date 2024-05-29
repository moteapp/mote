import { IPointer } from "@mote/editor/common/recordCommon";
import { createAppSlice } from "mote/app/common/createAppSlice";
import { URI } from "vs/base/common/uri";
import { generateUuid } from "vs/base/common/uuid";

export interface IHistory {
    history: IPointer[] | undefined;
}

const initialState: IHistory = {history: undefined};

export const historySlice = createAppSlice({
    name: "history",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: create => ({
        addToHistory: create.reducer<IPointer>((state, action) => {
            if (!state.history) {
                state.history = [];
            }
            state.history.push(action.payload);
        }),
    }),
    selectors: {
        selectHistory: (state) => state.history,
    }
});

// Action creators are generated for each case reducer function.
export const { addToHistory } = historySlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectHistory } = historySlice.selectors;