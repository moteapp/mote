import { localize } from "mote/base/common/i18n";
import { ContentEditable } from "mote/editor/browser/controller/contentEditable";
import { Selectable } from "mote/editor/browser/controller/selectable";
import { useState } from "react";

export const EditorHead = () => {
    const [title, setTitle] = useState<string>('');

    const handleMutation = (mutation: any) => {
        setTitle(mutation.newValue);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

    const getHtml = () => {
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
                    onKeyDown={handleKeyDown}
                    getHtml={getHtml}
                />
            </Selectable>
        </div>
    )
}