import get from 'lodash/get';
import { IOperation } from "mote/platform/editor/common/editor";
import { IBlockAndRole, IBlockProvider } from '../blockCommon';

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

export abstract class CursorOperation {
    constructor(private readonly operation: IOperation) {}

    runCommand(recordProvider: IBlockProvider) {
        const record =
            recordProvider.provideBlock(this.operation.id) || ({} as IBlockAndRole);
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
