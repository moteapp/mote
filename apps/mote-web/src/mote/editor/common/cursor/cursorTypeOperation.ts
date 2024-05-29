import { RecordModel } from "mote/editor/common/model/recordModel";
import { ListAfterCommand, SetCommand } from "../commands/cursorCommand";
import { EditOperationType, IEditOperationResult } from "../cursorCommon";
import { IRecordProvider, RecordEditType } from "mote/editor/common/recordCommon";
import { BlockModel } from "../model/blockModel";
import { URI } from "vs/base/common/uri";
import { Schemas } from "mote/base/common/network";
import { generateUuid } from "vs/base/common/uuid";
import { insert } from "vs/base/common/arrays";

export class TypeOperations {

    public static type(model: RecordModel<any>, text: string): IEditOperationResult {

        return {
            type: EditOperationType.TypingOther,
            commands: [
                TypeOperations.createSetCommand(model, [[text]])
            ],
            shouldPushStackElementBefore: true,
            shouldPushStackElementAfter: true,
        }
    }

    public static lineBreak(parent: RecordModel<string[]>, current: RecordModel): IEditOperationResult {
        const id = generateUuid();
        const resource = URI.from({
            scheme: Schemas.record,
            authority: 'block',
            path: '/' + id});
        const child = new BlockModel(resource, parent.recordProvider);

        let command: ListAfterCommand;
        if (parent.id === current.id) {
            // current is the parent, child will be the first child
            command = this.appendToParent(parent, child);
        } else {
            command = this.insertChildAfter(parent, child, current);
        }
        return {
            type: EditOperationType.TypingOther,
            commands: [
                command
            ],
            shouldPushStackElementBefore: true,
            shouldPushStackElementAfter: true,
        }
    }

    private static insertChildAfter(parent: RecordModel, insert: RecordModel, after: RecordModel): ListAfterCommand {
        return this.createListAfterCommand(parent, {id: insert.id, after: after.id});
    }

    private static appendToParent<T>(parent: RecordModel<T>, append: RecordModel<any>): ListAfterCommand {
        return this.createListAfterCommand(parent, {id: append.id});
    }

    private static createListAfterCommand<T>(model: RecordModel<T>, data: {id: string, after?: string}): ListAfterCommand {
        return new ListAfterCommand({
            id: model.id,
            table: model.table,
            path: model.path,
            type: RecordEditType.ListAfter,
            args: data
        });
    }

    private static createSetCommand<T>(model: RecordModel<T>, data: any): SetCommand {
        return new SetCommand({
            id: model.id,
            table: model.table,
            path: model.path,
            type: RecordEditType.Set,
            args: data
        });
    }
}