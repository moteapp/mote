import { RecordService } from "@mote/editor/common/services/recordService";
import { MoteEditor } from "./moteEditor";

export const createMoteEditor = (
    parentElement: HTMLElement,
) => {
    const moteEditor = new MoteEditor(parentElement, {} as any);
    return moteEditor;
};
