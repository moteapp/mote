import { MoteResponse, clientAPI } from "mote/app/client"

export interface IUserProfile {
    id: string
    name: string
    email: string
}

export const login = async(payload: IUserProfile): Promise<MoteResponse<IUserProfile>> => {
    clientAPI.post("/login", payload)
    return {} as any;
}