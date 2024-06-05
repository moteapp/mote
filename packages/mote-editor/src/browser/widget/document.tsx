import { TextEditable } from "@mote/editor/browser/controller/textbased";
import { ViewController } from "@mote/editor/browser/view/viewController";
import { BlockModel } from "@mote/editor/common/model/blockModel";
import { useEffect, useReducer } from "react";
import { localize } from "@mote/base/common/nls";

export interface IDocumentProps {
    model: BlockModel;
    viewController: ViewController;
}

export const Document = (props: IDocumentProps) => {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const blocks = props.model.getChildrenModels();
    const placeholder = localize('notebook.placeholder', 'Type something...');

    const renderBlock = (model: BlockModel, index: number) => {
        return (
            <TextEditable
                key={model.id}
                lineNumber={index+1}
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
        <div className="layout-content page-content" style={{fontSize: 16}}>
            {blocks.map((model, index) => renderBlock(model, index))}
        </div>
    )
}