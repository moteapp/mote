import { Lodash } from 'mote/base/common/lodash';
import { IOperation, IRecord, RecordEditType } from 'mote/editor/common/recordCommon';
import { Transaction } from 'mote/platform/database/common/transaction';

interface ListAfterArgs {
    id: string;
    after: string;
}

export class CellOperations {

    public static insertChildAfterTarget(parent: IRecord, insert: IRecord, after: IRecord, transaction: Transaction) {
        this.addOperationForRecord(['content'], parent, { id: insert.id, after: after.id }, transaction, RecordEditType.ListAfter);
		const child = insert;
        child.parentId = parent.id;
		this.addUpdateOperationForRecord([], child, { parentId: parent.id }, transaction);
		return {
			parent: parent,
			child: child
		};
    }

    public static addUpdateOperationForRecord(path: string[], record: IRecord, data: any, transaction: Transaction) {
        return this.addOperationForRecord(path, record, data, transaction, RecordEditType.Update);
    }

    public static addSetOperationForRecord(path: string[], record: IRecord, data: any, transaction: Transaction) {
        return this.addOperationForRecord(path, record, data, transaction, RecordEditType.Set);
    }

    public static addOperationForRecord(path: string[], record: IRecord, data: any, transaction: Transaction, type: RecordEditType) {
		transaction.addOperation(
			{
				id: record.id,
				table: record.table,
				path: path,
				type: type,
				args: data
			}
		);
	}
}

export class RecordOperations {

    public static update(value: any, args: any, version: number) {
        value = value || {};
        return Object.assign({}, value, {}, args);
    }

    public static listAfter(value: any[], args: ListAfterArgs, version: number) {
        value = filterAllNotEqId({
            id: args.id
        }, value);
        const index = value.findIndex(t=>t === args.after);
        index >= 0 ? value.splice(index + 1, 0, args.id) : value.push(args.id);
        return value
    }

    public static applyOperation(record: IRecord, operation: IOperation) {
        record = record || {};
        
        let value = operation.path.length > 0 ? Lodash.get(record, operation.path) : record
        let version = record.version ? record.version + calcVersion(operation) : calcVersion(operation);

    }
}

function filterAllNotEqId(record: any, value: any[]) {
    value = value.filter(t=>t !== record.id);
    return value
}

function calcVersion(operation: IOperation){
    return void 0 === operation.size ? 1 : operation.size;
};