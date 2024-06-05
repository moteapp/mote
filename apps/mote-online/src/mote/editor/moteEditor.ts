import './media/moteEditor.css';
import { TextEditable } from './controller/textbased';
import { FastDomNode } from '@mote/base/browser/fastDomNode';
import { BlockModel } from '@mote/editor/common/model/blockModel';
import { IRecordService } from '@mote/editor/common/services/record';
import { ViewModel } from '@mote/editor/common/viewModel/viewModel';
import { ICommandDelegate } from '@mote/editor/browser/view/viewController';
import { RecordModel } from '@mote/editor/common/model/recordModel';
import { ISegment } from '@mote/editor/common/recordCommon';
import { clearNode } from '@mote/base/browser/dom';
import { Disposable } from '@mote/base/common/lifecycle';
import { DomEmitter } from '@mote/base/browser/event';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Schema, DOMParser } from 'prosemirror-model';
import {findWrapping} from 'prosemirror-transform';
import {keymap} from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { menuBar, menuPlugin } from './viewParts/menuPart';


export class MoteEditor extends Disposable {

    private parent: HTMLElement | undefined;

    private header: TextEditable | undefined;
    private editorView: EditorView | undefined;
	private titleArea: HTMLElement | undefined;
	private contentArea: HTMLElement | undefined;
	private footerArea: HTMLElement | undefined;

    private model: BlockModel | undefined;
    
    constructor(
        @IRecordService private recordService: IRecordService,
    ) {
       super();
    }

    //#region dom area

    create(parent: HTMLElement, options?: object): void {
		this.parent = parent;
        clearNode(this.parent);
        //this.parent.setAttribute('contenteditable', 'true');
        this.parent.classList.add('page-layout');

        const hidden = document.createElement('div');
        hidden.style.display = 'contents';
        this.parent.appendChild(hidden);

        const layoutFull = document.createElement('div');
        layoutFull.className = 'layout-full';
        this.parent.appendChild(layoutFull);
       
		this.titleArea = this.createTitleArea(parent, options);
		this.contentArea = this.createContentArea(parent, options);

        this.parent.appendChild(this.titleArea);
        this.parent.appendChild(this.contentArea);
	}

    private registerListeners(): void {
        if (!this.parent) {
            return;
        }
        const onKeyDown = this._register(new DomEmitter(this.parent, 'keydown')).event;
        this._register(onKeyDown(e => {
            console.log('keydown', e);
        }));
    }

    /**
	 * Returns the overall part container.
	 */
	getContainer(): HTMLElement | undefined {
		return this.parent;
	}

    createTitleArea(parent: HTMLElement, options?: object): HTMLElement {
        const titleArea = document.createElement('div');
        titleArea.className = 'layout-content';
        titleArea.style.marginTop = '80px';
        this.header = new TextEditable(document.createElement('h1'), { placeholder: 'Untitled' });
        titleArea.appendChild(this.header.getDOMNode());
        return titleArea;
    }

    createContentArea(parent: HTMLElement, options?: object): HTMLElement {
        /*
        const content = new EditorView(parent, {placeholder: 'Type something...'});
        this.editorView = content;
        parent.appendChild(content.getDOMNode());
        return content.getDOMNode();
        */

        const noteSchema = new Schema({
            nodes: {
              text: {},
              note: {
                content: "text*",
                toDOM() { return ["note", 0] },
                parseDOM: [{tag: "note"}]
              },
              notegroup: {
                content: "note+",
                toDOM() { return ["notegroup", 0] },
                parseDOM: [{tag: "notegroup"}]
              },
              doc: {
                content: "(note | notegroup)+"
              }
            }
        });

        function makeNoteGroup(state: EditorState, dispatch: any) {
            // Get a range around the selected blocks
            let range = state.selection.$from.blockRange(state.selection.$to)!;
            // See if it is possible to wrap that range in a note group
            let wrapping = findWrapping(range, noteSchema.nodes.notegroup)
            // If not, the command doesn't apply
            if (!wrapping) return false
            // Otherwise, dispatch a transaction, using the `wrap` method to
            // create the step that does the actual wrapping.
            if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView())
            return true
          }

        const editor = document.createElement('div');
        editor.className = 'layout-content page-content';
        const view = new EditorView(editor, {
            state: EditorState.create({
                schema: noteSchema,
                plugins: [keymap({"Ctrl-Enter": makeNoteGroup}), keymap(baseKeymap), menuBar]
            })
        });
        view.dom.style.height = '100%';
        (window as any).view = view;

        parent.appendChild(editor);
        return editor;
    }

    //#endregion

    public setModel(model: BlockModel) {
        this.model = model;

        const viewModel = new ViewModel(model, this.recordService);
        const commandDelegate: ICommandDelegate = {
            type: (text: string, model: RecordModel<ISegment[]>) => viewModel.type(text, model),
            lineBreak: (model: RecordModel<ISegment[]>) => viewModel.lineBreak(model),
            getSelection: () => viewModel.selection,
        } as any;

        //const titleModel = this.model.getTitleModel();
        //this.editorView!.attachModel(model);
    }
}