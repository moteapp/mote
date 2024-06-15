import { IPointer, IRecordWithRole } from "@mote/editor/common/recordCommon";
import { clientAPI } from "mote/app/client";

interface PromiseWithAction<T> {
    promise: Promise<T>;
    resolve: (value: T | Promise<T>) => void;
    reject: (reason?: any) => void;
}

function buildPromiseWithAction<T>(): PromiseWithAction<T> {
    let resolve: (value: T | Promise<T>) => void = null as any;
    let reject: (reason?: any) => void = null as any;
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return {
        promise,
        resolve,
        reject,
    }
}

interface ResultWithTimeout<T> {
    result?: T;
    timeout: boolean;
}

async function requestWithTimeout<T>(timeout: number, requests: Promise<T>[]): Promise<ResultWithTimeout<T>> {
    const timeoutPromise = buildPromiseWithAction<ResultWithTimeout<T>>();
    const timeoutFunc = setTimeout(() => {
        timeoutPromise.resolve({
            timeout: true,
        });
    }, timeout);

    const requestsWithActions = Promise.race(requests).then((result) => ({
        result,
        timeout: false,
    }));

    const result = await Promise.race([timeoutPromise.promise, requestsWithActions]);
    clearTimeout(timeoutFunc);
    return result;
    
}

type QueueItem<T, K> = [T, PromiseWithAction<K>];

interface IRequestQueueOptions<R, S> {
    batchSize: number;
    maxWorkers: number;
    requestDelay: number;
    requestTimeout: number;
    performRequest: (items: R[]) => Promise<S[]>;
}

class RequestQueue<REQUEST, RESPONSE> {

    private queue: QueueItem<REQUEST, RESPONSE>[] = [];

    private batchSize: number;
    private currentSetTimeout: number = 0;
    private currentWorkers = 0;

    constructor(private options: IRequestQueueOptions<REQUEST, RESPONSE>) {
        this.batchSize = options.batchSize;
    }

    enqueue(request: REQUEST): Promise<RESPONSE> {
        const item = buildPromiseWithAction<RESPONSE>();
        this.queue.push([request, item]);
        this.dequeueAfterTimeout();
        return item.promise;
    }

    async dequeue() {
        this.currentSetTimeout = 0;
        if ( this.currentWorkers >= this.options.maxWorkers || this.queue.length === 0) {
            return;
        }
        this.currentWorkers++;
        const items = this.queue.splice(0, this.batchSize);
        const requests = items.map(item=> item[0]);

        let batchResult: RESPONSE[] = [], err;
        try {
            if (this.options.requestTimeout) {
                const response = await requestWithTimeout(this.options.requestTimeout, [this.options.performRequest(requests)]);
                if (response.timeout) {
                    throw new Error('Request timeout');
                }
                batchResult = response.result!;
            } else {
                batchResult = await this.options.performRequest(requests);
            }
        } catch (e) {
            err = e;
        }

        try {
            if (err) {
                items.forEach(([, item]) => item.reject(err));
            } 
            if (batchResult.length === items.length) {
                items.forEach(([, item], index) => item.resolve(batchResult[index]));
            }
        } finally {
            this.currentWorkers--;
            if (this.queue.length >= this.batchSize) {
                this.dequeue();
            } else {
                this.dequeueAfterTimeout();
            }
        }
    }

    private dequeueAfterTimeout() {
        if (this.currentSetTimeout < this.options.maxWorkers) {
            this.currentSetTimeout++;
            setTimeout(() => this.dequeue, this.options.requestDelay);
        }
    }
}

type IRecordMap = {[key: string]: {[key: string]: IRecordWithRole}};

class RecordMap {

    constructor(
        private readonly data: IRecordMap
    ) {

    }

    get = (table: string, id: string) => {
        const tableData = this.data[table];
        if (tableData) {
            return tableData[id];
        }
    }

    getByTable = (table: string) => {
        const tableData = this.data[table];
        return Object.entries(tableData).map((entry) => {
            return {
                pointer: {
                    table,
                    id: entry[0],
                },
                value: entry[1],
            }
        });
    }
}


interface ISyncRecordValueRequest {
    id: string;
    table: string;
    version: number;
}

async function syncRecordValues(requests: ISyncRecordValueRequest[]): Promise<RecordMap> {
    if (requests.length === 0) {
        return new RecordMap({});
    }
    const requestMap: {[key: string]: ISyncRecordValueRequest} = {};
    requests.forEach(request => {
        const key = `${request.table}:${request.id}:${request.version}`;
        if (!requestMap[key]) {
            requestMap[key] = request;
        }
    });
    requests = Object.keys(requestMap).map(key => requestMap[key]);
    const recordValues = await clientAPI.post('/api/records/values', { requests });
    return new RecordMap(recordValues || {});
}

const syncRecordValuesQueue = new RequestQueue<ISyncRecordValueRequest, IRecordWithRole|undefined>({
    batchSize: 10,
    maxWorkers: 5,
    requestDelay: 200,
    requestTimeout: 3000,
    performRequest: async (requests) => {
        const recordMap = await syncRecordValues(requests);
        return requests.map(request => recordMap.get(request.table, request.id));
    }
});

/**
 * Sync the record with server side.  
 * It's possiable to return an undefined value if the record is not found(deleted by another user)
 * @param pointer 
 * @returns RecordWithRole
 */
export async function syncRecordValue(pointer: IPointer): Promise<IRecordWithRole|undefined> {
   
    return syncRecordValuesQueue.enqueue({
        id: pointer.id,
        table: pointer.table,
        version: -1
    })
}