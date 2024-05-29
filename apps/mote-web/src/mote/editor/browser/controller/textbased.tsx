import { ContentEditable, ContentEditableWrapper, IMutation } from "./contentEditable";
import { ISegment, getTextFromSegments } from "mote/editor/common/recordCommon";
import { createRef, useState, useEffect } from "react";
import { ViewController } from "../view/viewController";
import { RecordModel } from "mote/editor/common/model/recordModel";
import { Editable } from "./editable";
import { EditorSelection } from "mote/editor/common/core/selection";
import { NavigationCommandRevealType } from "../commands/navigation";
import { Position } from "mote/editor/common/core/position";
import { DisposableStore } from "vs/base/common/lifecycle";

export interface TextBasedProps {
    tag?: string;
    lineNumber: number;
    model: RecordModel<ISegment[]>;
    placeholder: string;
    viewController: ViewController;
}


export const TextEditable = (props: TextBasedProps) => {
    const { model, viewController } = props;
    const titleTxt = getTextFromSegments(props.model.value);

    const contentEdiableRef = createRef<ContentEditable>();
    const [title, setTitle] = useState<string>(titleTxt);
    const [selection, setSelection] = useState<EditorSelection | null>(viewController.getSelection());

    const canEdit = () => {
        return props.lineNumber === selection?.startLineNumber;
    }

    //#region Listeners
    const disposeStore = new DisposableStore();
    disposeStore.add(viewController.onCursorStateChanged((e) => {
        setSelection(viewController.getSelection());
    }));

    useEffect(() => {
        return () => {
            disposeStore.dispose();
        }
    });

    //#endregion

    //#region Navigation

    const moveUp = () => {
        if (!canEdit()) {
            return false;
        }
        const selection = viewController.getSelection();
        const newPosition = selection.getPosition().delta(-1, 0);
        moveTo(newPosition);
        return true;
    }

    const moveDown = () => {
        if (!canEdit()) {
            return false;
        }
        const selection = viewController.getSelection();
        const newPosition = selection.getPosition().delta(+1, 0);
        moveTo(newPosition);
        return true;
    }

    const moveLeft = () => {
        if (!canEdit()) {
            return false;
        }
        const selection = viewController.getSelection();
        const newPosition = selection.getPosition().delta(0, -1);
        moveTo(newPosition);
        return true;
    }

    const moveRight = () => {
        if (!canEdit()) {
            return false;
        }
        const selection = viewController.getSelection();
        const newPosition = selection.getPosition().delta(0, +1);
        moveTo(newPosition);
        return true;
    }

    const moveTo = (position: Position) => {
        viewController.moveTo(position, NavigationCommandRevealType.Regular);
    }

    //#endregion

    //#region Handlers

    const handleMutation = (mutation: IMutation) => {
        viewController.type(mutation.newValue, props.model);
        setTitle(mutation.newValue);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    }

    const handleSelect = (selection: EditorSelection) => {
        if (selection.startLineNumber === selection.endLineNumber
            && selection.startColumn === selection.endColumn
            && selection.startLineNumber === props.lineNumber
        ) {
            moveTo(selection.getPosition());
        }
    }

    const handleEnter = () => {
        if (!canEdit()) {
            return false;
        }
        viewController.lineBreak(props.model);
        return true;
    }

    const handleInput = () => {
        if (!canEdit()) {
            return false;
        }
        contentEdiableRef.current?.handleInput();
        return true;
    }

    //#endregion

    const getHtml = () => {
        return title;
    }

    const renderContentControls = () => {
        return (
            <ContentEditableWrapper
                ref={contentEdiableRef}
                tagName={props.tag ?? 'div'}
                placeholder={props.placeholder}
                lineNumber={props.lineNumber}
                onMutation={handleMutation}
                onKeyDown={handleKeyDown}
                onSelect={handleSelect}
                getHtml={getHtml} 
                getSelection={()=>selection}
            />
        )
    }

    return (
        <Editable
            onArrowUp={moveUp}
            onArrowDown={moveDown}
            onArrowLeft={moveLeft}
            onArrowRight={moveRight}
            onEnter={handleEnter}
            onInput={handleInput}
            render={renderContentControls}
        />
    )
}