import { ContentEditable } from "mote/editor/browser/contentEditable";
import { Selectable } from "mote/editor/browser/selectable";
import { useEffect, useRef, useState } from "react";
import { InputBox } from "vs/base/browser/ui/inputbox/inputBox";
import { localize } from "vs/nls";

export const NotebookTitle = () => {
    const [title, setTitle] = useState<string>('');

    const handleMutation = (mutation: any) => {
        setTitle(mutation.newValue);
    }

    const getHtml = () => {
        //console.log('getHtml', title)
        return title;
    }

    const placeholder = localize('notebookTitle.placeholder', "Untitled");

    return (
        <div>
            <Selectable >
                <ContentEditable 
                    tagName="h1"
                    placeholder={placeholder}
                    onMutation={handleMutation}
                    getHtml={getHtml}
                />
            </Selectable>
        </div>
    )
}