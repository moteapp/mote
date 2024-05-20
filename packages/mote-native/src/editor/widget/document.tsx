import { ViewController } from "@mote/editor/browser/view/viewController";
import { BlockModel } from "@mote/editor/common/model/blockModel";
import { useEffect, useReducer } from "react";
import { TextBased } from "mote/editor/controller/textbased";
import { ScrollView, View } from "react-native";

export interface IDocumentProps {
    model: BlockModel;
    viewController?: ViewController;
    fontSize?: number;
    readonly: boolean;
}

export const Document = (props: IDocumentProps) => {

    const { model: pageModel, viewController, fontSize, readonly } = props;

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const contentModel = pageModel.getContentModel();
    const blocks = pageModel.getChildrenModels();
    const placeholder = 'Type something...';

    const renderBlock = (model: BlockModel, index: number) => {
        return (
            <View style={{paddingTop: 5}} key={model.id}>
                <TextBased
                    key={model.id}
                    lineNumber={index+1}
                    readonly={readonly}
                    style={{fontSize: fontSize ?? 16}}
                    model={model.getTitleModel()}
                    placeholder={placeholder}
                    viewController={viewController}
                />
            </View>
        )
    }

    useEffect(() => {
        const disposeable = contentModel.onDidChangeValue((e) => {
            console.log('force update when contentModel changed', e);
            forceUpdate();
        });

        return () => {
            disposeable.dispose();
        }
    });

    console.log('render document', pageModel.id, blocks.map(b => b.id));

    return (
       
        <View style={{paddingTop: 10}}>
            {blocks.map((model, index) => renderBlock(model, index))}
        </View>
    )
}