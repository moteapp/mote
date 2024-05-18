import { RecordService } from "@mote/editor/common/services/recordService";

const memory: Record<string, any> = {};
const storageService: any = {
    get: (key: string) => memory[key],
    store: (key: string, value: string) => {
        console.log('set record', value)
        memory[key] = value;
    }
}
export const recordService = new RecordService(storageService);
