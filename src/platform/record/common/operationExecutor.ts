import filter from 'lodash/filter';
import get from 'lodash/get';
import { IOperation, OperationType } from 'mote/platform/request/common/request';
import { IRecordService } from "./record";

export function calcVersion(operation: IOperation) {
    return operation.size ?? 1;
}

function updateObjectByPath(obj: any, path: string[], value: any) {
    if (path.length === 0) {
        return value;
    }
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
            current[path[i]] = {};
        }
        current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    return obj;
}

//#region Operation handler

type ListOperationTarget = {id: string} & object | string;
export type ListOperationPayload = {id: string, after?: string, before?: string};

function listAfterHandler(value: ListOperationTarget[], args: ListOperationPayload, version: number) {
    const {id, after} = args;
    value = filter(value, (item) => {
        if (typeof item === 'string') {
            return item !== id;
        }
        return item.id !== id;
    });
    const index = value.findIndex((item) => {
        if (typeof item === 'string') {
            return item === after;
        } 
        return item.id === after;
    });
    if (index >= 0) {
        value.splice(index + 1, 0, id);
    } else {
        value.push(id);
    }
    console.log('listAfterHandler', value);
    return value;
}

function listBeforeHandler(value: ListOperationTarget[], args: ListOperationPayload, version: number) {
    const {id, before} = args;
    value = filter(value, (item) => {
        if (typeof item === 'string') {
            return item !== id;
        }
        return item.id !== id;
    });
    const index = value.findIndex((item) => {
        if (typeof item === 'string') {
            return item === before;
        }
        return item.id === before;
    });
    if (index >= 0) {
        value.splice(index, 0, id);
    } else {
        value.unshift(id);
    }
    return value;
}

function listRemoveHandler(value: ListOperationTarget[], args: ListOperationTarget, version: number) {
    const id = typeof args === 'string' ? args : args.id;
    value = filter(value, (item) => {
        if (typeof item === 'string') {
            return item !== id;
        }
        return item.id !== id;
    });
    return value;
}

const operationHandlers = {
    [OperationType.Update]: (value: any, args: any, version: number) => {
        value = value || {};
        return Object.assign({}, value, args);
    },
    [OperationType.Set]: (value: any, args: any, version: number) => {
        return args;
    },
    [OperationType.ListAfter]: listAfterHandler,
    [OperationType.ListBefore]: listBeforeHandler,
    [OperationType.ListRemove]: listRemoveHandler,
};

//#endregion

export class OperationExecutor {

	public static async runOperation(operation: IOperation, recordService: IRecordService) {
		const pointer = { id: operation.id, table: operation.table };
		let record = await recordService.retriveRecordAsync(pointer) || (pointer as any);

        let value = operation.path.length > 0 ? get(record, operation.path): record;
        const prevVersion = record.version ?? 0;
        record.version = prevVersion;
        const version = record.version + calcVersion(operation);

        value = this.execute(value, operation, version);
        record = operation.path.length > 0 ? updateObjectByPath(record, operation.path, value) : value;
        record.version = version;

        return record;
    }

    private static execute(value: any, operation: IOperation, version: number): any {
        const handler = operationHandlers[operation.type];
        return handler(value, operation.args, version);
    }

}