import { IRecordWithRole } from "@mote/editor/common/recordCommon"
import { createAppSlice } from "mote/app/createAppSlice";



export type RecordsSliceState = {

}

const initialState: RecordsSliceState = {
    profile: null,
    spaces: [],
    status: "idle",
}

export const recordsSlice = createAppSlice({
    name: 'records',
    initialState: initialState as RecordsSliceState,
    reducers: create => ({
        
    }),
});

