import * as MysqlClient from 'mysql2';
import { FindOptions, IRetriveOptions, IStorageService } from './storage.js';
import { IEntity, IEntityWithNamespace, isEntityProperty, listEntityProperties } from '@mote/client/model/entity';
import { QueryBuilder } from './queryBuilder.js';
import { InstantiationType, registerSingleton} from '@mote/platform/instantiation/common/extensions';
import { environment } from 'mote/common/enviroment.js';
import { ResultSetHeader } from 'mysql2';

const host = environment.MYSQL_HOST;
const user = environment.MYSQL_USER;
const password = environment.MYSQL_PASSWORD;
const database = environment.MYSQL_DATABASE;

class MySqlStorageService implements IStorageService {

    declare readonly _serviceBrand: undefined;

	private pool: MysqlClient.Pool;

	constructor() {
        console.log(`[StorageService] connecting to mysql://${user}@${host}/${database}`);
		this.pool = MysqlClient.createPool({
			connectionLimit: 20,
            enableKeepAlive: true,
            keepAliveInitialDelay: 60 * 60 * 1000,
            password,
            user,
            database,
            host,
            port: 3306,
            insecureAuth: true,
		});
	}

	async execute<T>(query:string, args?:any[]): Promise<T[]> {
        console.log(`[StorageService] execute: ${query} with args: ${args?.join(', ')}`);
        const [rows, fields] = await this.pool.promise().execute(query, args);
        return rows as T[];
    }

    async count<T extends IEntity>(query: Record<string, any>, namespace: string) {
        const queryBuilder = QueryBuilder.builder<T & {created_at: number}>()
            .from(namespace)
            .where(query);
        
        const [sql, args] = queryBuilder.toCountSql();
        const results = await this.execute<{count: number}>(sql, args);
        return results[0].count;
    
    }

	async find<T extends IEntity>(query: Record<string, any>, namespace: string, options?: FindOptions<T>) {
		const queryBuilder = QueryBuilder.builder<T & {created_at: number}>()
            .from(namespace)
            .where(query)
            .limit(options?.top || 10)
       
        if (options?.orderBy) {
            queryBuilder.orderBy(options.orderBy);
        }
        if (options?.select) {
            for (const field of options.select) {
                queryBuilder.select(field);
            }
        } else {
            queryBuilder.select('*');
        }
        const [sql, args] = queryBuilder.toSelectSql();

        let result = await this.execute<T>(sql, args);

        if (options?.mapper) {
            result = result.map(item => {
                const newItem = {} as T;
                Object.keys(item).forEach((key) => {
                    const property = key as keyof T;
                    newItem[options.mapper![key] as keyof T || property] = item[property];
                });
                return newItem;
            });
        }

        if (options?.transform) {
            result = result.map(options.transform);
        }

		return result
	}

    async retrieve<T extends IEntity>(id: number, namespace: string, options?: IRetriveOptions<T>) {
        const results = await this.find<T>({id}, namespace);
        if (results.length === 1) {
            let result = results[0];
            if (options?.mapper) {
                const newItem = {} as T;
                Object.keys(result).forEach((key) => {
                    const property = key as keyof T;
                    newItem[options.mapper![key] as keyof T || property] = result[property];
                });
                result = newItem;
            }
            if (options?.transform) {
                result = options.transform(result);
            }
            return result;
        }
        return null;
    }

    async update<T extends IEntityWithNamespace>(item: Partial<T> & Pick<T, 'namespace' | 'id'>) {
        const query = QueryBuilder.builder<T>().update(item.namespace).where({id: item.id});
        // fill the query with the item
        for (const key of listEntityProperties(item)) {
            query.column(key, item[key]);
        };
        const [ sql, args ] = query.toUpdateSql();
        await this.execute(sql, args);
        return this.retrieve<Omit<T, 'namespace'>>(item.id, item.namespace) as Promise<T>;
    }

    async create<T extends IEntityWithNamespace>(item: Partial<T> & Pick<T, 'namespace'> & Omit<T, 'id'>) {
        const query = QueryBuilder.builder<T>().insert(item.namespace);
        // fill the query with the item
        Object.keys(item).forEach(key => {
            if (isEntityProperty(key)) {
                query.column(key, item[key] === undefined ? null : item[key]);
            }
        });
        const [ sql, args ] = query.toInsertSql();
        const result = await this.execute(sql, args) as any as ResultSetHeader;
        return result.insertId;
    }
}

registerSingleton(IStorageService, MySqlStorageService, InstantiationType.Delayed);