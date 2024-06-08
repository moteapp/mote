import { IEntity, IEntityWithNamespace } from "@mote/client/model/entity";
import { IStorageService } from "./storage/storage";

export interface IModelService<T extends IEntity> {

    count(query: Record<string, any>): Promise<number>;

    find(query: Record<string, any>): Promise<T[]>;

    create(item: Partial<Omit<T, 'id'>>): Promise<void>;

    update(item: Partial<T>): Promise<T>;

    retrieve(id: number): Promise<T|null>;
}