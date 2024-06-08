import { IUserModel } from "@mote/client/model/model";

export function safeUser(user: IUserModel) {
    const { jwtSecret, ...ret } = user;
    return ret;
}