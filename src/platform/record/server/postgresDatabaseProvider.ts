import { Prisma } from '@prisma/client';
import { match } from 'ts-pattern';
import { Event, Emitter } from 'mote/base/common/event';
import { prisma } from "mote/base/parts/storage/common/prisma";
import { IDatabaseProvider, IRecord, Pointer, RecordChangeEvent } from "../common/record";

export class PostgresDatabaseProvider implements IDatabaseProvider {

    private _onDidChange = new Emitter<RecordChangeEvent>();
    public readonly onDidChange: Event<RecordChangeEvent> = this._onDidChange.event;

    public get<T extends IRecord>(pointer: Pointer): T | null {
        throw new Error('Method not implemented.');
    }

    public async getAsync<T extends IRecord>(pointer: Pointer): Promise<T|null> {
        const { id } = pointer;
        return match(pointer)
        .when(isBlockTable, async () => {
            return await prisma.block.findUnique({ where: { id } }) as T | null;
        })
        .run();
    }

    public async set<T extends IRecord>(pointer: Pointer, value: T): Promise<void> {
        console.log('set', pointer, value);
        const { id } = pointer;
        match(pointer)
        .when(isBlockTable, async () => {
            return await prisma.block.upsert({
                where: { id },
                create: value as unknown as Prisma.BlockCreateInput,
                update: value as unknown as Prisma. BlockUpdateInput,
            });
        })
        .run();
    }

    public async delete(pointer: Pointer): Promise<void> {
        const { id } = pointer;
        match(pointer)
        .when(isBlockTable, async () => {
            return await prisma.block.delete({ where: { id } });
        })
        .run();
    }

    public watch(resource: Pointer, opts: any): any {

    }
}

function isBlockTable(pointer: Pointer) {
    return pointer.table === 'block';
}