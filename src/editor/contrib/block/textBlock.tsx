'use client';
import React, { ReactNode, useEffect, } from "react";
import { IBlockComponentProps } from "mote/editor/browser/blockComponent";
import { ContentEditableInput } from "mote/editor/browser/controller/contentEditableInput";
import { ViewController } from "mote/editor/browser/view/viewController";
import { ITextBlock } from "mote/editor/common/blockCommon";
import { BlockModel } from "mote/editor/common/model/blockModel";


export type TextBlockProps = Omit<IBlockComponentProps, 'block'> & {
    blockModel: BlockModel;
    viewController: ViewController;
};

export class TextBlock extends React.PureComponent<TextBlockProps> {
    refEditable = React.createRef<ContentEditableInput>();

    getValue(): string {
        return '';
    }

    onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>, value: string) => {
        console.log('onKeyUp', e.key);
        this.setText(value);
    }

    onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        console.log('onKeyDown', e.key);
        if (e.key === 'Enter') {
            e.preventDefault();
            this.props.viewController.lineBreakInsert(this.props.blockModel);
        }
    }

    setText = (value: string) => {
        //const textValue = getTextBlockTextValue(block);
        this.props.viewController.type(value, this.props.blockModel.getTextValueModel());
    };

    setValue = (value: string) => {
        this.refEditable.current?.setValue(value);
    }

    componentDidMount(): void {
        this.setValue(this.props.blockModel.getText());
    }

    render(): ReactNode {
        return (
            <div className="flex">
                <div className="markers"></div>
                <ContentEditableInput
                    ref={this.refEditable}
                    onKeyUp={this.onKeyUp}
                    onKeyDown={this.onKeyDown}
                />
            </div>
        );
    }
}
