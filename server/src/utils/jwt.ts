import { IUserModel } from "@mote/client/model/model";
import { subMinutes } from "date-fns";
import JWT from 'jsonwebtoken';
import { AuthenticationError } from "mote/common/errors";
import { instantiationService } from "mote/service/service.all";
import { IUserService } from "mote/service/user/user";

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
        throw AuthenticationError("Invalid token");
    }

    try {
        JWT.verify(token, user.jwtSecret);
      } catch (err) {
        throw AuthenticationError("Invalid token");
    }

    return user;
}