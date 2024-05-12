import { createAppSlice } from "mote/app/createAppSlice";
import type { IRecordWithRole } from "mote/platform/record/common/recordCommon";


const initialState: Record<string, IRecordWithRole> = {};

export const recordsSlice = createAppSlice({
    name: "records",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: create => ({
        setRecord: create.reducer<IRecordWithRole>((state, action) => {
            state[action.payload.record.id] = action.payload;
        }),
        removeRecord: create.reducer<string>((state, action) => {
            delete state[action.payload];
        }),
    }),
    selectors: {
        selectRecord: (state, id: string) => {
            let record = state[id];
            if (!record) {
                return {record: {}}
            }
            return record;
        }
    }
});

// Action creators are generated for each case reducer function.
export const { setRecord, removeRecord } = recordsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectRecord } = recordsSlice.selectors
