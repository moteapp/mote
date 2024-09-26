import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAppSlice } from 'mote/app/store/createAppSlice';
import { client, AuthConfig } from 'mote/platform/request/common/request';

type AuthCredential = {
    token: string;
};

type AuthState = {
    config?: AuthConfig;
    isLogging: boolean;
    emailLinkSentTo?: string;
    credential?: AuthCredential;
};

const initialState: AuthState = {
    isLogging: false,
};

export const fetchAuthConfig = createAsyncThunk('auth/fetchByIdStatus', async () => {
    const response = await client.getAuthConfig();
    return response;
});

export const generateOneTimePassword = createAsyncThunk(
    'auth/generateOneTimePassword',
    async (email: string) => {
        const response = await client.generateOneTimePassword(email);
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
        const { token } = await client.loginWithOneTimePassword(email, code);
        return { token };
    }
);

export const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetEmailLinkSendTo(state) {
            state.emailLinkSentTo = undefined;
        },
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
            state.credential = { token: payload.token };
        });
    },
    selectors: {
        selectAuthConfig: (state: AuthState) => state.config,
        selectIsLogging: (state: AuthState) => state.isLogging,
        selectEmailLinkSentTo: (state: AuthState) => state.emailLinkSentTo,
        selectCredential: (state: AuthState) => state.credential,
    },
});

export const { resetEmailLinkSendTo } = authSlice.actions;

export const {
    selectAuthConfig,
    selectIsLogging,
    selectEmailLinkSentTo,
    selectCredential,
} = authSlice.selectors;
