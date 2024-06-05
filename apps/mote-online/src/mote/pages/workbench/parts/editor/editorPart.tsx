import { URI } from '@mote/base/common/uri.js';
import { generateUuid } from '@mote/base/common/uuid.js';
import { MoteEditorWidget } from '@mote/editor/browser/widget/moteEditorWidget.js';
import { BlockModel } from '@mote/editor/common/model/blockModel.js';
import { IRecordProvider } from '@mote/editor/common/recordCommon.js';
import { RecordService } from '@mote/editor/common/services/recordService.js';
import { TextEditable } from 'mote/editor/controller/textbased';
import { MoteEditor } from 'mote/editor/moteEditor';
import { createRef, useEffect } from 'react';

export const EditorPart = () => {
    const containerEl = createRef<HTMLDivElement>();
    const id = generateUuid();
    const memory: Record<string, any> = {};
	const storageService: any = {
		get: (key: string) => memory[key],
		store: (key: string, value: string) => {
			console.log('set record', value)
			memory[key] = value;
		}
	}
	const recordService = new RecordService(storageService);
    const resource = URI.from({scheme: 'record', authority: 'block', path: '/'+id})
        const recordProvider: IRecordProvider = {
            provideRecord: (uri: URI) => { 
                return recordService.getRecord(uri)!;
            }
        };
    const model = new BlockModel(resource, recordProvider);

    useEffect(() => {
        if (containerEl.current) {
            const editor = new MoteEditor(recordService);
            editor.create(containerEl.current);
            editor.setModel(model);
        }
    });
    return (
        <div style={{flex: 1, display: 'flex'}}>
            <div ref={containerEl} ></div>
        </div>
    )
}