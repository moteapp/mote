import Router from '@koa/router';
import { environment } from 'mote/common/enviroment';

export type AuthenticationProviderConfig = {
    id: string;
    name: string;
    enabled: boolean;
    router: Router;
};

export class AuthenticationProviders {
    private providersCache: AuthenticationProviderConfig[] = [];

    public get providers() {
        if (this.providersCache) {
            return this.providersCache;
        }

        const authenticationProviderConfigs: AuthenticationProviderConfig[] = [];
        const rootDir = environment.ENVIRONMENT === "test" ? "" : "dist";
    }
}