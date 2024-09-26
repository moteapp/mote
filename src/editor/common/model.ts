import { Event } from 'mote/base/common/event';

export interface IModel<T> {
    readonly onDidChange: Event<T>;

    readonly state: T;
}