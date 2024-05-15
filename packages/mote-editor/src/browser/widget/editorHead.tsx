import { TextEditable } from "@mote/editor/browser/controller/textbased";
import { ICommandDelegate, ViewController } from "@mote/editor/browser/view/viewController";
import { IRecord, ISegment, getTextFromSegments } from "@mote/editor/common/recordCommon";
import { RecordModel } from "@mote/editor/common/model/recordModel";
import { localize } from "@mote/base/common/nls";

interface IEditorHeadProps {
    model: RecordModel<ISegment[]>;
    viewController: ViewController;
}

export const EditorHead = (props: IEditorHeadProps) => {

    const placeholder = localize('notebookTitle.placeholder', "Untitled");

    return (
        <div className="layout-content">
            <TextEditable
                tag='h1'
                lineNumber={0}
                placeholder={placeholder}
                {...props}
            />
        </div>
    )
}