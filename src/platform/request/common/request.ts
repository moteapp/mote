
export type AuthProvider = {
    id: string;
    name: string;
    authUrl: string;
};

export type AuthConfig = {
    name?: string;
    logo?: string;
    providers: AuthProvider[];
};

export class ApiClient {
    public async get<T>(url: string): Promise<T> {
        const response = await fetch(url);
        const json = await response.json();
        return json.data;
    }

    public async post<T>(url: string, data: any): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    public async put<T>(url: string, data: any): Promise<T> {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    public async delete<T>(url: string): Promise<T> {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        return response.json();
    }

    /**
     * Accquire the auth config.
     * @returns AuthConfig
     */
    public async getAuthConfig(): Promise<AuthConfig> {
        return this.get<AuthConfig>('/api/auth/config');
    }

    public async generateOneTimePassword(email: string): Promise<void> {
        return this.post<void>('/api/auth/one-time-password', { email });
    }

    public async loginWithOneTimePassword(
        email: string,
        code: string
    ): Promise<LoginWithOneTimePasswordResponse> {
        return this.get<LoginWithOneTimePasswordResponse>(
            `/api/auth/one-time-password?email=${email}&code=${code}`
        );
    }
}

export type LoginWithOneTimePasswordResponse = {
    token: string;
};

export const client = new ApiClient();
