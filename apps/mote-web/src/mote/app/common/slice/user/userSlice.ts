import { createAppSlice } from "mote/app/createAppSlice";
import { generateUuid } from "vs/base/common/uuid";

export interface IUser {
    id: string;
    username?: string;
    email?: string;
}

const initialState: IUser = {} as any;

export const userSlice = createAppSlice({
    name: "user",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: create => ({
        createUser: create.reducer((state, action) => {
            const userId = generateUuid();
            state.id = userId;
        }),
    }),
    selectors: {
        selectUser: (state) => state,
    }
});

// Action creators are generated for each case reducer function.
export const { createUser } = userSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUser } = userSlice.selectors;