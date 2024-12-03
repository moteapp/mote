import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAppSlice } from 'mote/app/store/createAppSlice';
import { ISpace, IUser } from 'mote/base/parts/storage/common/schema';
import { AuthConfig, AuthProvider } from 'mote/platform/request/common/request';
import { requestService } from 'mote/platform/request/common/requestService';

type AuthCredential = {
    token: string;
    provider: AuthProvider;
};

type AuthState = {
    config?: AuthConfig;
    isLogging: boolean;
    emailLinkSentTo?: string;
    credential?: AuthCredential;
    user?: IUser;
    space?: ISpace;
};

const initialState: AuthState = {
    isLogging: false,
};

export const fetchAuthConfig = createAsyncThunk('auth/fetchByIdStatus', async () => {
    const response = await requestService.getAuthConfig();
    return response;
});

export const generateOneTimePassword = createAsyncThunk(
    'auth/generateOneTimePassword',
    async (email: string) => {
        const response = await requestService.generateOneTimePassword(email);
        return { email };
    }
);

export type LoginWithOneTimePasswordPayload = {
    email: string;
    code: string;
};

export const loginWithOneTimePassword = createAsyncThunk(
    'auth/loginWithOneTimePassword',
    async (payload: LoginWithOneTimePasswordPayload) => {
        const { email, code } = payload;
        return requestService.loginWithOneTimePassword(email, code);
    }
);

export const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetEmailLinkSendTo(state) {
            state.emailLinkSentTo = undefined;
        },
        logout(state) {
            state.credential = undefined;
            state.user = undefined;
            state.space = undefined;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAuthConfig.fulfilled, (state, action) => {
            state.config = action.payload;
        });
        builder.addCase(generateOneTimePassword.pending, (state) => {
            state.isLogging = true;
        });
        builder.addCase(generateOneTimePassword.fulfilled, (state, { payload }) => {
            state.isLogging = false;
            state.emailLinkSentTo = payload.email;
        });
        builder.addCase(generateOneTimePassword.rejected, (state) => {
            state.isLogging = false;
        });
        builder.addCase(loginWithOneTimePassword.fulfilled, (state, { payload }) => {
            state.credential = { token: payload.token, provider: payload.provider };
            state.user = payload.user;
            state.space = payload.space;
        });
    },
    selectors: {
        selectAuthConfig: (state: AuthState) => state.config,
        selectIsLogging: (state: AuthState) => state.isLogging,
        selectEmailLinkSentTo: (state: AuthState) => state.emailLinkSentTo,
        selectCredential: (state: AuthState) => state.credential,
        selectUser: (state: AuthState) => state.user,
        selectSpace: (state: AuthState) => state.space,
    },
});

export const { resetEmailLinkSendTo, logout } = authSlice.actions;

export const {
    selectAuthConfig,
    selectIsLogging,
    selectEmailLinkSentTo,
    selectCredential,
    selectUser,
    selectSpace
} = authSlice.selectors;
