import { Event } from "mote/base/common/event";
import { IDisposable } from "mote/base/common/lifecycle";
import { createDecorator } from "mote/platform/instantiation/common/instantiation";

export interface IRecord extends Record<string, any> {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDatabaseProviderActivationEvent {
	readonly scheme: string;
	join(promise: Promise<void>): void;
}

export interface RecordChangeEvent<T extends IRecord = IRecord> {
	record: T;
}

export const IRecordService = createDecorator<IRecordService>('IRecordService');

export interface IRecordService {

	readonly _serviceBrand: undefined;

	onDidRecordChange: Event<RecordChangeEvent>;
    /**
	 * An event that is fired when a database provider is about to be activated. Listeners
	 * can join this event with a long running promise to help in the activation process.
	 */
	readonly onWillActivateDatabaseProvider: Event<IDatabaseProviderActivationEvent>;

    /**
	 * Registers a database provider for a certain scheme.
	 */
	registerProvider(scheme: string, provider: IDatabaseProvider): IDisposable;

	/**
	 * Returns a database provider for a certain scheme.
	 */
	getProvider(scheme: string): IDatabaseProvider | undefined;

    /**
	 * Tries to activate a provider with the given scheme.
	 */
	activateProvider(scheme: string): Promise<void>;

    retriveRecord<T extends IRecord>(pointer: Pointer): T | null;

    retriveRecordAsync<T extends IRecord>(pointer: Pointer): Promise<T|null>;

	updateRecord<T extends IRecord>(pointer: Pointer, record: T): Promise<void>;
}

export enum DatabaseProviderCapabilities {
    /**
	 * No capabilities.
	 */
	None = 0,
    Readonly,
    ReadWrite,
}

export type Pointer = {
    id: string;
    table: string;
}

export interface IWatchOptions {}

export interface IDatabaseProvider {
	onDidChange: Event<RecordChangeEvent>;
    watch(resource: Pointer, opts: IWatchOptions): IDisposable;
    get<T extends IRecord>(pointer: Pointer): T | null;
    getAsync<T extends IRecord>(pointer: Pointer): Promise<T|null>;
    set<T extends IRecord>(pointer: Pointer, value: T): Promise<void>;
    delete(pointer: Pointer): Promise<void>;
}
