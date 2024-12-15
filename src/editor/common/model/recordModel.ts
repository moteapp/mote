import get from 'lodash/get';
import { Event, Emitter } from "mote/base/common/event";
import { Disposable } from "mote/base/common/lifecycle";
import { IRecordService, Pointer } from 'mote/platform/record/common/record';
import { BlockRole } from "../blockCommon";
import { IModel } from "../model";

interface IInstanceState<T> {
    value: T;
    role?: BlockRole;
    ready: boolean;
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
            parent.recordService
        );
        parent.addChildModel(childModel);
        return childModel;
    }

    private readonly _onDidChange = this._register(
        new Emitter<IInstanceState<T>>()
    );

    public readonly onDidChange = this._onDidChange.event;

    private instanceState: IInstanceState<T> = { value: null, ready: false} as any;

    constructor(
        public pointer: Pointer,
        public readonly path: string[],
        public readonly recordService: IRecordService,
    ) {
        super();

        const onBlockChange = Event.filter(
            recordService.onDidRecordChange, 
            (e) => e.record.id === pointer.id
        );
        this._register(onBlockChange((e) => this.handleBlockChange()));
        this.handleBlockChange();
    }

    private async handleBlockChange() {
        const block = await this.recordService.retriveRecordAsync(this.pointer);
        let value: T;
        if (this.path && this.path.length) {
            value = get(block, this.path);
        } else {
            value = block as T;
        }
        this.instanceState = { value, ready: true };
        this._onDidChange.fire(this.instanceState);
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
        return this.state.value || {} as T;
    }

    public async load() {
        if (this.state.ready) {
            return Promise.resolve();
        }
        await this.waitUtil(() => this.state.ready);
    }

    private waitUtil(predict: () => boolean): Promise<void> {
        return new Promise((resolve) => {
            if (predict()) {
                resolve();
            }
            const listener = this.onDidChange((e) => {
                if (predict()) {
                    resolve();
                    listener.dispose();
                }
            });
        });

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
