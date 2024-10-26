'use client';
import React, { KeyboardEventHandler } from 'react';
import { keyboard } from 'mote/editor/common/keyboard';
import './media/input.css';

export type ContentEditableInputProps = {
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    onKeyUp?: (e: React.KeyboardEvent<HTMLDivElement>, value: string) => void;
}

export class ContentEditableInput extends React.PureComponent<ContentEditableInputProps> {
    refEditable = React.createRef<HTMLDivElement>();

    getTextValue(): string {
        // Todo: check the rich text format
        return this.refEditable.current
            ? this.refEditable.current.innerText
            : '';
    }

    onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Chinese IME is open
        if (keyboard.isComposition) {
            return;
        }
        if (this.props.onKeyUp) {
            this.props.onKeyUp(e, this.getTextValue());
        }
    }

    onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Chinese IME is open
		if (keyboard.isComposition) {
			return;
		}
        if (this.props.onKeyDown) {
            this.props.onKeyDown(e);
        }
    }

    onCompositionStart = (e: any) => {
        keyboard.setComposition(true);
    }

    onCompositionEnd = (e: any) => {
        keyboard.setComposition(false);
    }

    setValue = (value: string) => {
        if (this.refEditable.current) {
            this.refEditable.current.innerHTML = value;
        }
    }

    render(): React.ReactNode {
        return (
            <div className="editableWrap">
                <div 
                    className="editable" 
                    contentEditable="true"
                    ref={this.refEditable}
                    onKeyUp={this.onKeyUp}
                    onKeyDown={this.onKeyDown}
                    onCompositionStart={this.onCompositionStart}
                    onCompositionEnd={this.onCompositionEnd}
                />
            </div>
        );
    }
}