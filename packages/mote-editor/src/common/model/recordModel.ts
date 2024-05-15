import { Lodash } from '@mote/base/common/lodash';
import { Disposable } from 'vs/base/common/lifecycle';
import type { IOperation, IPointer, IRecord, IRecordModel, IRecordProvider, IRecordWithRole } from "../recordCommon";
import { Emitter, Event } from 'vs/base/common/event';
import { EditorSelection } from '@mote/editor/common/core/selection';
import { URI } from 'vs/base/common/uri';

interface IInstanceState<T> {
    value: T;

}

export class RecordModel<T = any> extends Disposable implements IRecordModel {

    static generateRecordKey(uri: URI, path?: string[]): string {
        const id = uri.path;
        const table = uri.authority;
        let key = `${table}:${id}`;
        if (path) {
            key += `:${path.join('/')}`;
        }
        return key;
    }

    static createChildModel<T>(
        parent: RecordModel<any>, 
        uri: URI, 
        path: string[], 
        recordProvider: IRecordProvider
    ) : RecordModel<T> {
        let childModel = parent.getChildModel(uri, path);
        if (childModel) {
            return childModel;
        }
        childModel = new RecordModel<T>(uri, path, recordProvider);
        parent.addChildModel(childModel);
        return childModel;
    }

    private _onDidChangeValue = this._register(new Emitter<T>());
	public readonly onDidChangeValue: Event<T> = this._onDidChangeValue.event;

    private parent: RecordModel<any> | null = null;
    private childModels: Record<string, RecordModel> = {};

    private instanceState: IInstanceState<T> = {} as any;

    constructor(
        protected uri: URI,
        public readonly path: string[],
        public readonly recordProvider: IRecordProvider
    ) {
        super();
    }

    public get id() {
        return this.uri.path.substring(1);
    }

    public get table() {
        return this.uri.authority;
    }

    get state() {
        const record = this.recordProvider.provideRecord(this.uri);
        if (this.path && this.path.length) {
            this.instanceState.value = Lodash.get(record, this.path);
        } else {
            this.instanceState.value = record as T;
        }
        return this.instanceState;
    }

    get value() {  
        return this.state.value;
    }

    setParent<T extends RecordModel<any>>(parent: T) {
        this.parent = parent;
    }

    addChildModel<T extends RecordModel>(childModel: T) {
        const key = RecordModel.generateRecordKey(childModel.uri, childModel.path);
        this.childModels[key] = childModel;
        childModel.setParent(this);
    }

    getChildModel<T extends RecordModel>(uri: URI, path: string[]): T {
        const key = RecordModel.generateRecordKey(uri, path);
        return this.childModels[key] as T;
    }

    public async awaitNonNullValue(): Promise<T> {
        const value = this.value;
        if (value) {
            return value;
        }
        return new Promise<T>((resolve) => {

        });
    }

    public pushEditOperations(beforeCursorState: EditorSelection[] | null, editOperations: IOperation[]) {
        this._onDidChangeValue.fire(this.value);
    }
}