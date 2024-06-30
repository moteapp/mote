import { ICollectionModel } from "@mote/client/model/model";
import { MoteResponse } from "@mote/client/response";
import { clientAPI } from "mote/app/client";

export const createCollection = async(payload: Partial<ICollectionModel>): Promise<MoteResponse<ICollectionModel[]>> => {
    return clientAPI.post("/collections", payload)
}

export const getCollections = async(): Promise<MoteResponse<ICollectionModel[]>> => {
    return clientAPI.get("/collections")
}