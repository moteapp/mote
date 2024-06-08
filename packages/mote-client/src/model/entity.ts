export interface IEntity {
	id: number;
	createdAt: number;
}

export interface IEntityWithNamespace extends IEntity {
	namespace: string;
}

export function isEntityProperty<T>(key: any): key is keyof T {
	return Boolean(key !== 'id' && key !== 'namespace');
}

export function listEntityProperties<T extends {}>(entity: T): (keyof T)[] {
	return Object.keys(entity).filter(isEntityProperty);
}