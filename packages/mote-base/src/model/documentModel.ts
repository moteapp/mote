import { ProsemirrorData } from './types';

export type DocumentModel = {
    id: string;
    data: ProsemirrorData;
    lastViewedAt?: string;
}