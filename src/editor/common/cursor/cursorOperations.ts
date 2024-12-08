import filter from 'lodash/filter';
import get from 'lodash/get';
import { IOperation, OperationType } from 'mote/platform/request/common/request';
import { BlockRole, IBlock, IBlockAndRole, IBlockProvider, IBlockStore } from '../blockCommon';
import { RecordModel } from '../model/recordModel';

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

//#region Cursor Operations

export abstract class CursorOperation {
    constructor(private readonly operation: IOperation) {}

    public runCommand(store: IBlockStore) {
        const record =
            store.get(this.operation.id) || ({block: {}, role: BlockRole.Editor} as IBlockAndRole);
        let block = record.block;

        let value =
            this.operation.path.length > 0
                ? get(block, this.operation.path)
                : block;
        const prevVersion = block.version ?? 0;
        block.version = prevVersion;
        const version = block.version + calcVersion(this.operation);

        value = this.execute(value, this.operation.args, version);
        block =
            this.operation.path.length > 0
                ? updateObjectByPath(block, this.operation.path, value)
                : value;
        block.version = version;

        record.block = block;
        store.set(block.id, record);
        console.log('runCommand', this.operation, record);
        return record;
    }

    protected abstract execute(value: any, args: any, version: number): any;

    public toJSON() {
        return this.operation;
    }
}

export class UpdateOperation extends CursorOperation {

    protected execute(value: any, args: any, version: number): any {
        value = value || {};
        return Object.assign({}, value, args);
    }
}

export class SetOperation extends CursorOperation {

    protected execute(value: any, args: any, version: number): any {
        return args;
    }
}

type ListOperationTarget = {id: string} & object | string;

export class ListAfterOperation extends CursorOperation {
    protected execute(value: ListOperationTarget[], args: ListOperationTarget, version: number): any {
        const id = typeof args === 'string' ? args : args.id;
        value = filter(value, (item) => {
            if (typeof item === 'string') {
                return item !== id;
            }
            return item.id !== id;
        });
        const index = value.findIndex((item) => {
            if (typeof item === 'string') {
                return item === id;
            }
            return item.id === id;
        });
        if (index >= 0) {
            value.splice(index + 1, 0, args);
        } else {
            value.push(args);
        }
        return value;
    }
}

//#endregion

export function newUpdateOperation(
    block: IBlock,
    data: Partial<IBlock>
): UpdateOperation {
    return new UpdateOperation({
        id: block.id,
        table: 'block',
        path: [],
        type: OperationType.Update,
        args: data,
    });
}

export function newSetOperation<T>(
    block: RecordModel<T>,
    data: Partial<T>
): SetOperation {
    const { id , table, path } = block;
    return new SetOperation({
        id,
        table,
        path,
        type: OperationType.Set,
        args: data,
    });
}

export function newListAfterOperation<T>(
    block: RecordModel<T>,
    data: ListOperationTarget
): ListAfterOperation {
    const { id , table, path } = block;
    return new ListAfterOperation({
        id,
        table,
        path,
        type: OperationType.ListAfter,
        args: data,
    });
}

export function appendToParentOperation(
    parent: RecordModel,
    child: RecordModel
) {
    return newListAfterOperation(parent, child.id);
}