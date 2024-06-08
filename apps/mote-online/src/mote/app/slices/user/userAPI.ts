import { clientAPI } from "mote/app/client"
import { IAuthInfo, MoteResponse } from "@mote/client/response";

export interface IUserProfile {
    id: number
    username: string
    email: string
}

export const login = async(payload: IUserProfile): Promise<MoteResponse<IUserProfile>> => {
    clientAPI.post("/login", payload)
    return {} as any;
}

export const fetchAuthInfo = async(): Promise<MoteResponse<IAuthInfo>> => {
    return clientAPI.get("/auth/info")
}