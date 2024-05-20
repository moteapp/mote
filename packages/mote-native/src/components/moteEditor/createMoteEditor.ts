import * as mote from '@mote/editor/standalone/browser/standloneEditor';

export const createMoteEditor = (
    parentElement: HTMLElement,
) => {
    const moteEditor = mote.create(parentElement, {});;
    return moteEditor;
};
