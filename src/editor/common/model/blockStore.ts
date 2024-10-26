'use client';
import { Emitter } from "mote/base/common/event";
import { BlockMap, IBlockAndRole, IBlockProvider, IBlockStore } from "../blockCommon";

export class BlockStore implements IBlockStore {

    public static Default = new BlockStore();

    private readonly _onDidChange = new Emitter<IBlockAndRole>();
    public readonly onDidChange = this._onDidChange.event;

    private state: BlockMap = {};

    constructor() {

    }

    public get(id: string) {
        const value = this.state[id];
        if (value) {
            return value;
        }
        
        const data = localStorage.getItem(id);
        if (data) {
            this.state[id] = JSON.parse(data);
            return this.state[id];
        }
    }

    public set(id: string, value: IBlockAndRole) {
        this.state[id] = value;
        localStorage.setItem(id, JSON.stringify(value));
        this._onDidChange.fire(value);
    }

    public remove(id: string) {
        delete this.state[id];
    }
}