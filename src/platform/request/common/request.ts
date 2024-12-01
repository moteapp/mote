//#region ApplyTransationsRequest

export enum OperationType {
    Update = 0,
    Set,
    ListBefore,
    ListAfter,
    ListRemove,
}

export interface IOperation {
    id: string;
    table: string;
    path: string[];
    type: OperationType;
    args: any;
    size?: number;
}

export type TransactionData = {
    id: string;
    userId: string;
    operations: IOperation[];
    timestamp: number;
};

export type ApplyTransationsRequest = {
    traceId: string;
    transactions: TransactionData[];
};

export type ApplyTransationsResponse = {
    traceId: string;
    success: boolean;
}

//#endregion

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


export type LoginWithOneTimePasswordResponse = {
    token: string;
};