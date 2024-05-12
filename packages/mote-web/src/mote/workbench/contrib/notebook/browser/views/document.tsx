import { TextEditable } from "mote/editor/browser/controller/textbased";
import { ViewController } from "mote/editor/browser/view/viewController";
import { BlockModel } from "mote/editor/common/model/blockModel";
import { RecordModel } from "mote/editor/common/model/recordModel"
import { ISegment } from "mote/editor/common/recordCommon";
import { useEffect, useReducer } from "react";
import { localize } from "vs/nls";

export interface IDocumentProps {
    model: BlockModel;
    viewController: ViewController;
}

export const Document = (props: IDocumentProps) => {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const blocks = props.model.getChildrenModels();
    const placeholder = localize('notebook.placeholder', 'Type something...');

    const renderBlock = (model: BlockModel) => {
        return (
            <TextEditable
                key={model.id}
                model={model.getTitleModel()}
                placeholder={placeholder}
                viewController={props.viewController}
            />
        )
    }

    useEffect(() => {
        const disposeable = props.model.onDidChangeValue(() => {
            forceUpdate();
        });

        return () => {
            disposeable.dispose();
        }
    });

    return (
        <div className="layout-content">
            {blocks.map((model, index) => renderBlock(model))}
        </div>
    )
}