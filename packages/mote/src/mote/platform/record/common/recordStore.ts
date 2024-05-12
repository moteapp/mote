import { Lodash } from 'mote/base/common/lodash';
import type { IPointer, IRecordProvider, IRecordWithRole } from "./recordCommon";

interface IInstanceState<T> {
    value: T;

}

export class RecordModel<T> {

    private parent: RecordModel<any> | null = null;
    private instanceState: IInstanceState<T> = {} as any;

    constructor(
        protected pointer: IPointer,
        protected path: string[],
        protected recordProvider: IRecordProvider
    ) {
        
    }

    get state() {
        const record = this.recordProvider.provideRecord(this.pointer);
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
}