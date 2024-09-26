export enum CommandType {
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
    type: CommandType;
    args: any;
    size?: number;
}
