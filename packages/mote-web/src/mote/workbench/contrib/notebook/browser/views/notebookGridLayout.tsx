import { IActiveNotebookEditorDelegate } from '../notebookBrowser';
import { useEffect, useRef } from 'react';
import { NotebookHead } from './notebookHead';

import './media/notebookLayout.css';
import { SpaceModel } from 'mote/editor/common/model/spaceModel';
import { BlockModel } from 'mote/editor/common/model/blockModel';
import { ViewModel } from 'mote/editor/common/viewModel/viewModel';
import { ICommandDelegate } from 'mote/editor/browser/view/viewController';
import { ViewController } from 'mote/editor/browser/view/viewController';
import { IRecordService } from 'mote/editor/common/services/record';
import { IPointer, IRecordProvider, ISegment } from 'mote/editor/common/recordCommon';
import { RecordModel } from 'mote/editor/common/model/recordModel';
import { Document } from './document';
import { KeyboardShortcut, KeyboardShortcutsRegistry } from 'mote/editor/browser/controller/keyboardBindingRegistry';
import { Lodash } from 'mote/base/common/lodash';

interface NotebookGirdLayoutProps {
    model: BlockModel;
    notebookEditor: IActiveNotebookEditorDelegate;
    recordService: IRecordService;
}

export const NotebookGirdLayout = (props: NotebookGirdLayoutProps) => {

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
            if (entry.shortcuts) {
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
            };
        }
    });

    return (
        <div className='notebook-layout' 
            contentEditable
            ref={documentElement}
        >
            <div></div>
            <NotebookHead
                viewController={viewController}
                model={pageModel.getTitleModel()}
            />
            <Document model={pageModel} viewController={viewController}/>
        </div>
    )
}