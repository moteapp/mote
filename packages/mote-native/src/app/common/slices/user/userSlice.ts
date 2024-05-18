import { createAppSlice } from "mote/app/common/createAppSlice";
import { generateUuid } from "vs/base/common/uuid";

export interface IUser {
    initialized: boolean;
    profile?: {
        id: string;
        username?: string;
        email?: string;
    }
}

const initialState: IUser = {initialized: false, profile: undefined};

export const userSlice = createAppSlice({
    name: "user",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: create => ({
        createUser: create.reducer<string | undefined>((state, action) => {
            const userId = action.payload || generateUuid();
            state.initialized = true;
            state.profile = {
                id: userId,
            };
        }),
    }),
    selectors: {
        selectUserProfile: (state) => state.profile,
        selectUserInitialized: (state) => state.initialized,
    }
});

// Action creators are generated for each case reducer function.
export const { createUser } = userSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUserProfile, selectUserInitialized } = userSlice.selectors;