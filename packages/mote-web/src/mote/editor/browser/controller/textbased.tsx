import { localize } from "vs/nls";
import { Selectable } from "./selectable";
import { ContentEditable, IMutation } from "./contentEditable";
import { ISegment, getTextFromSegments } from "mote/editor/common/recordCommon";
import { useState } from "react";
import { ViewController } from "../view/viewController";
import { RecordModel } from "mote/editor/common/model/recordModel";

export interface TextBasedProps {
    tag?: string;
    model: RecordModel<ISegment[]>;
    placeholder: string;
    viewController: ViewController;
}


export const TextEditable = (props: TextBasedProps) => {
    const { model, viewController } = props;
    const titleTxt = getTextFromSegments(props.model.value);
    const [title, setTitle] = useState<string>(titleTxt);

    const handleMutation = (mutation: IMutation) => {
        if (mutation.insertedLine) {
            viewController.lineBreak(props.model);
            return;
        }
        viewController.type(mutation.newValue, props.model);
        setTitle(mutation.newValue);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        
    }

    const getHtml = () => {
        return title;
    }

    const getContainerSelection = () => {
        
    }

    return (
        <div>
            <Selectable model={props.model}>
                <ContentEditable 
                    tagName={props.tag ?? 'div'}
                    placeholder={props.placeholder}
                    onMutation={handleMutation}
                    onKeyDown={handleKeyDown}
                    getHtml={getHtml}
                />
            </Selectable>
        </div>
    )
}