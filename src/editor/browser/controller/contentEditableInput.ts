import { addDisposableListener } from 'mote/base/browser/dom';
import { FastDomNode } from 'mote/base/browser/fastDomNode';
import { StandardKeyboardEvent } from 'mote/base/browser/keyboardEvent';
import { KeyCode } from 'mote/base/common/keyCodes';
import { Disposable } from 'mote/base/common/lifecycle';
import { ViewController } from '../view/viewController';

export class ContentEditableInput extends Disposable {

    private readonly domContainer: FastDomNode<HTMLDivElement>;
    private readonly domNode: FastDomNode<HTMLDivElement>;

    constructor(
        viewController: ViewController,
    ) {
        super();

        this.domContainer = new FastDomNode(document.createElement('div'));
        this.domContainer.setClassName('editableWrap');

        this.domNode = new FastDomNode(document.createElement('div'));
        this.domNode.setAttribute('contenteditable', 'true');

        this.domContainer.appendChild(this.domNode);

        this._register(addDisposableListener(this.domNode.domNode, 'keyup', (e) => viewController.emitKeyUp(new StandardKeyboardEvent(e))));
        this._register(
            addDisposableListener(this.domNode.domNode, 'keydown', async (e) => {
                const standardKeyboardEvent = new StandardKeyboardEvent(e);

                // When the IME is visible, the keys, like arrow-left and arrow-right, should be used to navigate in the IME, and should not be propagated further
                if (standardKeyboardEvent.keyCode === KeyCode.KEY_IN_COMPOSITION) {
                    standardKeyboardEvent.stopPropagation();
                }
                viewController.emitKeyDown(standardKeyboardEvent);
            })
        );
    }

    public getDomNode(): FastDomNode<HTMLDivElement> {
        return this.domContainer;
    }
}