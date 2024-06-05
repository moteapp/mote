import './media/moteEditor.css';
import { useEffect, useRef } from 'react';
import { BlockModel } from '@mote/editor/common/model/blockModel';
import { ViewModel } from '@mote/editor/common/viewModel/viewModel';
import { ICommandDelegate, ViewController } from '@mote/editor/browser/view/viewController';
import { IRecordService } from '@mote/editor/common/services/record';
import { ISegment } from '@mote/editor/common/recordCommon';
import { RecordModel } from '@mote/editor/common/model/recordModel';
import { Document } from './document';
import { KeyboardShortcutsRegistry } from '@mote/editor/browser/controller/keyboardBindingRegistry';
import { Lodash } from '@mote/base/common/lodash';
import { EditorHead } from '@mote/editor/browser/widget/editorHead';

interface MoteEditorWidgetProps {
    model: BlockModel;
    recordService: IRecordService;
}

export const MoteEditorWidget = (props: MoteEditorWidgetProps) => {

    const documentElement = useRef<HTMLDivElement>(null);

    const { recordService } = props;
    
    const pageModel = props.model;

    const viewModel = new ViewModel(pageModel, recordService);
    const commandDelegate: ICommandDelegate = {
        type: (text: string, model: RecordModel<ISegment[]>) => viewModel.type(text, model),
        lineBreak: (model: RecordModel<ISegment[]>) => viewModel.lineBreak(model),
        getSelection: () => viewModel.selection,
    } as any;

    const viewController = new ViewController(viewModel, commandDelegate);


    const handleKeyDown = (e: KeyboardEvent) => {
        handleEvent(e, e.key);
    }

    const handleInput = (e: Event) => {
        handleEvent(e as KeyboardEvent, 'Input');
    }

    const handleEvent = (e: KeyboardEvent, key: string) => {
        Lodash.findLast(KeyboardShortcutsRegistry.getStack(), (entry) => {
            if (entry.shortcuts && entry.listener) {
                const handler = entry.shortcuts[key];
                if (handler) {
                    return handler(e);
                }
            }
            return false;
        });
    }

    useEffect(() => {
        if (documentElement.current) {
            const element = documentElement.current;
            element.addEventListener('keydown', handleKeyDown);
            element.addEventListener('input', handleInput);

            return () => {
                element.removeEventListener('keydown', handleKeyDown);
                element.removeEventListener('input', handleInput);
            };
        }
    });

    return (
        <div className='page-layout' 
            contentEditable
            ref={documentElement}
        >
            <div></div>
            <EditorHead
                viewController={viewController}
                model={pageModel.getTitleModel()}
            />
            <Document model={pageModel} viewController={viewController}/>
        </div>
    )
}