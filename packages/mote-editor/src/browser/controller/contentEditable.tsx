import * as React from "react";

import './media/editable.css';
import * as ranges from '@mote/base/common/ranges';
import { EditorSelection } from "@mote/editor/common/core/selection";
import { createRange } from "../element";


export interface EditableProps {
    ref?: any;
    id?: string;
    lineNumber: number;
    tagName?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    onMutation?: (mutation: IMutation) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    onSelect?: (e: EditorSelection) => void;
    getHtml: () => string;
    getSelection: () => EditorSelection | null;
}

export interface IMutation {
    newValue: string;
    insertedLine: boolean;
    isComposing: boolean;
}

export const ContentEditableWrapper = React.forwardRef((props: EditableProps, ref: React.Ref<ContentEditable>) => {

    return <ContentEditable {...props} ref={ref} />;
});

export class ContentEditable extends React.Component<EditableProps> {
    html: string = '';
    previousHtml: string = '';
    ownNodeIsComposing: boolean = false;
    selection!: EditorSelection | null;

    root: HTMLDivElement | null = null;
    testDiv = document.createElement("div");

    isComposing() {
        return this.ownNodeIsComposing;
    }

    getText() {
        return this.root?.textContent || '';
    }

    //#region Handlers

    handleInput = () => {
        this.handleMutation({
            newValue: this.getText(),
            insertedLine: false,
            isComposing: this.isComposing()
        })
    }

    handleMutation = (mutation: IMutation) => {
        this.props.onMutation?.(mutation);
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        this.props.onKeyDown?.(e);
    }

    handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const range = ranges.get()
        if (range) {
            this.props.onSelect?.(new EditorSelection(
                this.props.lineNumber,
                range.startOffset + 1||1,
                this.props.lineNumber,
                range.endOffset + 1||1
            ));
        }
    }

    handleSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

    }

    handleBeforeInput = (e: InputEvent) => {
        if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') {
            e.preventDefault();
            this.handleMutation({
                newValue: this.getText(),
                insertedLine: true,
                isComposing: this.isComposing()
            });
        }
    }

    //#endregion

    //#region lifecycle

    updateContainer(force: boolean) {
        if (this.root) {
            if (force) {
                this.root.innerHTML = this.html;
            } else {
                if(this.previousHtml !== this.html) {
                    this.previousHtml = this.html;
                    this.testDiv.innerHTML = this.html
                }
                const e = this.root.innerHTML;
                const t = this.testDiv.innerHTML;
                if (e !== t) {
                    this.root.innerHTML = this.html;
                }
            }

            if (this.selection) {
                const isContains = this.selection.startColumn != this.selection.endColumn;
                const isSameLine = this.selection.startLineNumber === this.props.lineNumber && this.selection.endLineNumber === this.props.lineNumber;
                if (isSameLine && !isContains) {
                    this.root.focus();
                    const rangeShouldBe = createRange(this.root, this.selection.startColumn-1, this.selection.endColumn-1);
                    const currentRange = ranges.get();
                    if (!ranges.isEqual(rangeShouldBe, currentRange)) {
                        ranges.set(rangeShouldBe);
                    }
                }
            }
        }
    }

    UNSAFE_componentWillMount() {
        this.UNSAFE_willMountOrUpdate(this.props);
    }

    UNSAFE_componentWillUpdate(e: Readonly<EditableProps>) {
        this.UNSAFE_willMountOrUpdate(e);
    }

    UNSAFE_willMountOrUpdate(e: Readonly<EditableProps>) {
        this.html = e.getHtml!();
        this.selection = e.getSelection();
    }

    componentWillUnmount(): void {
        this.root?.removeEventListener("beforeinput", this.handleBeforeInput);
    }

    didMount() {
        this.updateContainer(true);
        if (this.root) {
            this.root.addEventListener("beforeinput", this.handleBeforeInput)
        }
    }

    didUpdate() {
        this.updateContainer(false);
    }

    componentDidMount(): void {
        this.didMount();
    }

    componentDidUpdate(prevProps: Readonly<EditableProps>, prevState: Readonly<{}>, snapshot?: any): void {
        this.didUpdate();
    }

    //#endregion

    render() {
        const placeholderStyle = Boolean(!this.html) ? {WebkitTextFillColor: 'rgba(55, 53, 47, 0.5)'} : {};
        const style = Object.assign({}, placeholderStyle);

        return React.createElement(this.props.tagName || 'div', {
            ref: (el: HTMLDivElement) => this.root = el,
            className: 'editable',
            contentEditable: true,
            placeholder: this.props.placeholder,
            style: style,
            onInput: this.handleInput,
            onKeyDown: this.props.onKeyDown,
            onClick: this.handleClick,
            'data-block-id': this.props.id
        });
    }
}