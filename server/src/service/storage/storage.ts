import { IEntity, IEntityWithNamespace } from '@mote/client/model/entity'

import { createDecorator } from "@mote/platform/instantiation/common/instantiation";


export interface FindOptions<T> {
	select?: (keyof T)[];
	top?: number;
	orderBy?: keyof T;
	mapper?: Record<string, string>;
	transform?: (item: T) => T;
}

export interface SaveOptions<T> {

}

export const IStorageService = createDecorator<IStorageService>('storageService');

export interface IStorageService {
    readonly _serviceBrand: undefined;

	execute<T>(query:string, args?:any[]): Promise<T[]>;

	count(query: Record<string, any>, namespace: string): Promise<number>;

	find<T extends IEntity>(query: Record<string, any>, namespace: string, options?: FindOptions<T>): Promise<T[]>;

	create<T extends IEntityWithNamespace>(item: Partial<T> & Pick<T, 'namespace'> & Omit<T, 'id'>): Promise<void>;

	update<T extends IEntityWithNamespace>(item: Partial<T> & Pick<T, 'namespace'>): Promise<Omit<T, 'namespace'>>;

	retrieve<T extends IEntity>(id: number, namespace: string): Promise<T|null>;
}