import { IOperation, IRecordProvider } from "@mote/editor/common/recordCommon";
import { ICommand } from "../editorCommon";
import { Lodash } from "@mote/base/common/lodash";
import { URI } from "vs/base/common/uri";
import { Schemas } from "@mote/base/common/network";

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

export abstract class CursorCommand implements ICommand {
    constructor(
        public readonly operation: IOperation,
    ){}

    runCommand(recordProvider: IRecordProvider) {
        let record = recordProvider.provideRecord(URI.from({
            scheme: Schemas.record,
            authority: this.operation.table,
            path: '/'+this.operation.id,
        })) || {};

        let value = this.operation.path.length > 0 ? Lodash.get(record, this.operation.path) : record;
        const lastVersion = record.version ?? 0;
        record.version = lastVersion;
        const version = record.version + calcVersion(this.operation);

        value = this.execute(value, this.operation.args, version);
        record = this.operation.path.length > 0 ? updateObjectByPath(record, this.operation.path, value) : value;
        record.version = version;
        record.lastVersion = lastVersion;
        return record;
    }

    protected abstract execute(value: any, args: any, version: number): any;
}

export class SetCommand extends CursorCommand implements ICommand {

    protected execute(value: any, args: any, version: number): any {
        return args;
    }
}

export class ListAfterCommand extends CursorCommand implements ICommand {

    protected execute(value: any[], args: {id: string, after?: string}, version: number): any[] {
        const idx = value.findIndex(v => v.id === args.after);
        if (idx > 0) {
            value.splice(idx + 1, 0, args.id);
        } else {
            value.push(args.id);
        }
        return value;
    }
}