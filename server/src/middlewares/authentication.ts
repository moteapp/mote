import { IUserModel } from "@mote/client/model/model";
import { Next } from "koa";
import { AuthenticationError } from "mote/common/errors";
import { AppContext, AuthenticationType } from "mote/context/context";

export type AuthenticationOptions = {
    /** An admin user role is required to access the route. */
    admin?: boolean;
    /** A member or admin user role is required to access the route. */
    member?: boolean;
    /** Authentication is parsed, but optional. */
    optional?: boolean;
};

async function authMiddleware(ctx: AppContext, next: Next) {
    let token;
    const authorizationHeader = ctx.request.get("authorization");

    if (authorizationHeader) {
        const parts = authorizationHeader.split(" ");

        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];
    
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            throw AuthenticationError(
                `Bad Authorization header format. Format is "Authorization: Bearer <token>"`
            );
        }
    }

    try {
        if (!token) {
          throw AuthenticationError("Authentication required");
        }

        let user: IUserModel | null;
        let type: AuthenticationType;

    } catch (error) {
        throw error;
    }

    return next();
}

export function auth(options: AuthenticationOptions = {}) {
    return authMiddleware;
}