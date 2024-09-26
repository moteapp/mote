import { Emitter } from "mote/base/common/event";
import { Disposable } from "mote/base/common/lifecycle";
import { Pointer, Role } from "../blockCommon";
import { IModel } from "../model";

interface IInstanceState<T> {
    value: T;
    role?: Role;
}

export class RecordModel<T = any>
    extends Disposable
    implements IModel<IInstanceState<T>>
{
    static generateRecordKey(pointer: Pointer, path?: string[]): string {
        const { id, table } = pointer;
        let key = `${table}:${id}`;
        if (path) {
            key += `:${path.join('/')}`;
        }
        return key;
    }

    static createChildModel<T>(
        parent: RecordModel<any>,
        pointer: Pointer,
        path: string[]
    ): RecordModel<T> {
        let childModel = parent.getChildModel(pointer, path);
        if (childModel) {
            return childModel;
        }
        childModel = new RecordModel<T>(
            pointer,
            [...parent.path, ...path],
            parent.blockProvider
        );
        parent.addChildModel(childModel);
        return childModel;
    }

    private readonly _onDidChange = this._register(
        new Emitter<IInstanceState<T>>()
    );

    public readonly onDidChange = this._onDidChange.event;

    private instanceState: IInstanceState<T> = {} as any;

    constructor(
        public pointer: Pointer,
        public readonly path: string[],
    ) {
        super();


        this.onBlockChange();
    }

    private onBlockChange() {
        const record = this.blockProvider.provideBlock(this.pointer);
        const role = record?.role;
        let value: T;
        if (this.path && this.path.length) {
            value = Lodash.get(record?.block, this.path);
        } else {
            value = record?.block as T;
        }

        this.instanceState = { value, role };
    }

    public get id() {
        return this.pointer.id;
    }

    public get table() {
        return this.pointer.table;
    }

    get state() {
        return this.instanceState;
    }

    get value() {
        return this.state.value;
    }

    getPropertyModel<T extends keyof this['value']>(
        property: T
    ): RecordModel<this['value'][T]> {
        return RecordModel.createChildModel<this['value'][T]>(
            this,
            this.pointer,
            [property as string]
        );
    }

    private childModels: Record<string, RecordModel> = {};
    getChildModel<T extends RecordModel>(pointer: Pointer, path: string[]): T {
        const key = RecordModel.generateRecordKey(pointer, path);
        return this.childModels[key] as T;
    }

    addChildModel<T extends RecordModel>(childModel: T) {
        const key = RecordModel.generateRecordKey(
            childModel.pointer,
            childModel.path
        );
        this.childModels[key] = childModel;
        childModel.setParent(this);
    }

    parent: RecordModel<any> | undefined;
    setParent<T extends RecordModel<any>>(parent: T) {
        this.parent = parent;
    }
}
