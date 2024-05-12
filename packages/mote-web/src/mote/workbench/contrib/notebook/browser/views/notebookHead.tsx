import { ContentEditable, IMutation } from "mote/editor/browser/controller/contentEditable";
import { Selectable } from "mote/editor/browser/controller/selectable";
import { TextEditable } from "mote/editor/browser/controller/textbased";
import { ICommandDelegate, ViewController } from "mote/editor/browser/view/viewController";
import { IRecord, ISegment, getTextFromSegments } from "mote/editor/common/recordCommon";
import { RecordModel } from "mote/editor/common/model/recordModel";
import { useEffect, useRef, useState } from "react";
import { localize } from "vs/nls";

interface INotebookHeadProps {
    model: RecordModel<ISegment[]>;
    viewController: ViewController;
}

export const NotebookHead = (props: INotebookHeadProps) => {

    const placeholder = localize('notebookTitle.placeholder', "Untitled");

    return (
        <div className="layout-content">
            <TextEditable
                tag='h1'
                placeholder={placeholder}
                {...props}
            />
        </div>
    )
}