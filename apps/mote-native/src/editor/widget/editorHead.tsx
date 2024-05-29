import { View } from "react-native"
import { TextBased } from "../controller/textbased"
import { RecordModel } from "@mote/editor/common/model/recordModel";
import { ISegment } from "@mote/editor/common/recordCommon";
import { ViewController } from "@mote/editor/browser/view/viewController";

export interface IEditorHeadProps { 
    model: RecordModel<ISegment[]>;
    viewController: ViewController;
}

export const EditorHead = (props: IEditorHeadProps) => {

    return (
        <View style={{paddingTop: 30}}>
            <TextBased 
                placeholder="Untitled" 
                style={{fontSize: 24, fontWeight: 'bold'}} 
                autoFocus={true}
                lineNumber={0}
                model={props.model}
                viewController={props.viewController}
            />
        </View>
    )
}