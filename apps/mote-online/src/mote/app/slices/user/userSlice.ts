import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from "mote/app/createAppSlice"
import type { AppThunk } from "mote/app/store"
import { IUserProfile } from './userAPI';
import * as userAPI from './userAPI';

interface LoggedUserSliceState {
    profile: IUserProfile;
    status: "logged";
}

interface InitialUserSliceState {
    profile: null;
    status: "idle" | "loading" | "failed" ;
}

export type UserSliceState = LoggedUserSliceState | InitialUserSliceState;

const initialState: UserSliceState = {
    profile: null,
    status: "idle",
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const userSlice = createAppSlice({
    name: "user",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: initialState as UserSliceState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: create => ({
        login: create.asyncThunk(
            async (profile: IUserProfile) => {
                const response = await userAPI.login(profile);
                // The value we return becomes the `fulfilled` action payload
                return response.data
            },
            {
                pending: state => {
                    state.status = "loading"
                },
                fulfilled: (state, action) => {
                    state.status = "logged";
                    state.profile = action.payload;
                },
                rejected: state => {
                    state.status = "failed"
                },
            },
        ),
    
    }),
    // You can define your selectors here. These selectors receive the slice
    // state as their first argument.
    selectors: {
        selectUser: user => user.profile,
        selectUserStatus: user => user.status,
    },
})

// Action creators are generated for each case reducer function.
export const { login } =
userSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUser, selectUserStatus } = userSlice.selectors
