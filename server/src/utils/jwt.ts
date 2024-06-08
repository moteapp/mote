import { IUserModel } from "@mote/client/model/model";
import { ConsoleLogger } from "@mote/platform/log/common/log";
import { subMinutes } from "date-fns";
import JWT from 'jsonwebtoken';
import { AuthenticationError } from "mote/common/errors.js";
import { instantiationService } from "mote/service/service.all.js";
import { IUserService } from "mote/service/user/user.js";


const logger = new ConsoleLogger();

export function getJWTPayload(token: string) {
    let payload;
  
    try {
        payload = JWT.decode(token);
    
        if (!payload) {
            throw AuthenticationError("Invalid token");
        }
  
        return payload as JWT.JwtPayload;
    } catch (err) {
        throw AuthenticationError("Unable to decode JWT token");
    }
}

export async function getUserForEmailSigninToken(token: string): Promise<IUserModel> {
    const payload = getJWTPayload(token);

    if (payload.type !== "email-signin") {
        logger.error(`Invalid token type, expect->email-signin, actual->payload.type`);
        throw AuthenticationError("Invalid token");
    }

    // check the token is within it's expiration time
    if (payload.createdAt) {
        if (new Date(payload.createdAt) < subMinutes(new Date(), 10)) {
            throw AuthenticationError("Expired token");
        }
    }

    const user = await instantiationService.invokeFunction((accessor)=>{
        const userService = accessor.get(IUserService);
        return userService.retrieve(payload.id);
    });

    if (!user) {
        logger.error(`User not found for token: ${token}`);
        throw AuthenticationError("Invalid token");
    }

    try {
        JWT.verify(token, user.jwtSecret);
      } catch (err) {
        logger.error(`Invalid token: ${err.message}`);
        throw AuthenticationError("Invalid token");
    }

    return user;
}

export async function getUserForJWT(token: string): Promise<IUserModel> {
    const payload = getJWTPayload(token);

    if (payload.type !== "session") {
        logger.error(`Invalid token type, expect->session, actual->${payload.type}`);
    }

    // check the token is within it's expiration time
    if (payload.expiresAt) {
        if (new Date(payload.expiresAt) < new Date()) {
            throw AuthenticationError("Expired token");
        }
    }

    const user = await instantiationService.invokeFunction((accessor)=>{
        const userService = accessor.get(IUserService);
        return userService.retrieve(payload.id);
    });

    if (!user) {
        throw AuthenticationError("Invalid token");
    }

    try {
        JWT.verify(token, user.jwtSecret);
    } catch (err) {
        throw AuthenticationError("Invalid token");
    }
    
    return user;
}

/**
   * Returns a session token that is used to make API requests and is stored
   * in the client browser cookies to remain logged in.
   *
   * @param expiresAt The time the token will expire at
   * @returns The session token
   */
export function getJwtToken(user: IUserModel, expiresAt?: Date){
    return JWT.sign(
        {
            id: user.id,
            expiresAt: expiresAt ? expiresAt.toISOString() : undefined,
            type: "session",
        },
        user.jwtSecret
    );
}