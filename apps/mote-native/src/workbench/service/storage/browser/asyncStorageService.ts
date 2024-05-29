import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUserProfile } from "mote/app/common/slices/user/userSlice";
import { Promises } from "vs/base/common/async";
import { Emitter } from "vs/base/common/event";
import { Disposable, IDisposable } from "vs/base/common/lifecycle";
import { IStorage, IStorageDatabase, IStorageItemsChangeEvent, IUpdateRequest, Storage } from "vs/base/parts/storage/common/storage";
import { ILogService } from "vs/platform/log/common/log";
import { AbstractStorageService, StorageScope } from "vs/platform/storage/common/storage";

export class AsyncStorageService extends AbstractStorageService {

    private applicationStorage: IStorage | undefined;
	private applicationStorageDatabase: IAsyncStorageDatabase | undefined;

	private profileStorage: IStorage | undefined;
	private profileStorageDatabase: IAsyncStorageDatabase | undefined;

	private workspaceStorage: IStorage | undefined;
	private workspaceStorageDatabase: IAsyncStorageDatabase | undefined;

    constructor(
        @ILogService private readonly logService: ILogService,
    ) {
        super();
    }

    protected async doInitialize(): Promise<void> {
        // Init storages
		await Promises.settled([
			this.createApplicationStorage(),
		]);
    }

    private async createApplicationStorage(): Promise<void> {
        const asyncStorageDB = await AsyncStorageDatabase.createApplicationStorage(this.logService);
        this.applicationStorageDatabase = this._register(asyncStorageDB);
        this.applicationStorage = this._register(new Storage(this.applicationStorageDatabase));

        this._register(this.applicationStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.APPLICATION, e)));

        await this.applicationStorage.init();
    }
}

interface IAsyncStorageDatabase extends IStorageDatabase, IDisposable {
    /**
	 * Name of the database.
	 */
	readonly name: string;
}

interface AsyncStorageDatabaseOptions {
    id: string;
    broadcastChanges: boolean;
}

type KeyValuePair = [string, string | null];

class AsyncStorageDatabase extends Disposable implements IAsyncStorageDatabase {

    static async createApplicationStorage(logService: ILogService): Promise<AsyncStorageDatabase> {
		return AsyncStorageDatabase.create({ id: 'global', broadcastChanges: true }, logService);
	}

    static async createProfileStorage(profile: IUserProfile, logService: ILogService): Promise<AsyncStorageDatabase> {
        return AsyncStorageDatabase.create({ id: `global-${profile}`, broadcastChanges: true }, logService);
    }

    static async createWorkspaceStorage(workspaceId: string, logService: ILogService): Promise<AsyncStorageDatabase> {
        return AsyncStorageDatabase.create({ id: `workspace-${workspaceId}`, broadcastChanges: true }, logService);
    }

    static async create(options: AsyncStorageDatabaseOptions, logService: ILogService): Promise<AsyncStorageDatabase> {
        return new AsyncStorageDatabase(options, logService);
    }

    private static readonly STORAGE_DATABASE_PREFIX = 'mote-state-db-';

    private readonly _onDidChangeItemsExternal = this._register(new Emitter<IStorageItemsChangeEvent>());
	readonly onDidChangeItemsExternal = this._onDidChangeItemsExternal.event;


    readonly name: string;

    private constructor(
        options: AsyncStorageDatabaseOptions,
        private readonly logService: ILogService
    ) {
        super();

        this.name = `${AsyncStorageDatabase.STORAGE_DATABASE_PREFIX}${options.id}`;
    }

    public async getItems(): Promise<Map<string, string>> {
        let values: readonly KeyValuePair[] = [];
        try {
            const keys = await AsyncStorage.getAllKeys();
            values = await AsyncStorage.multiGet(keys);
        } catch(e) {
            // read key error
        }

        const items = new Map<string, string>();
        if (values) {
            for (const [key, value] of values) {
                items.set(key, value || '');
            }
        }
        return items;
    }

    public async updateItems(request: IUpdateRequest): Promise<void> {
        const tasks: Promise<void>[] = [];
        if (request.insert) {
            tasks.push(this.insertItems(request.insert));
        }

        if (request.delete) {
            tasks.push(this.deleteItems(request.delete));
        }
        await Promise.all(tasks);
        return undefined;
    }

    private async insertItems(items: Map<string, string>): Promise<void> {
        const insertItems: [string, string][] = [];
        items.forEach((value, key) => insertItems.push([key, value]));

        try {
            await AsyncStorage.multiSet(insertItems);
        } catch(e) {
            // insert error
        }
    }

    private async deleteItems(keys: Set<string>): Promise<void> {
        try {
            await AsyncStorage.multiRemove(Array.from(keys));
        } catch(e) {
            // delete error
        }
    }

    public async optimize(): Promise<void> {
        // not suported in AsyncStorage
    }

    public async close(): Promise<void> {
        this.dispose();
    }
}