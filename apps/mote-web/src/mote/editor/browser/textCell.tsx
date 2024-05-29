import { ContentEditable } from "mote/editor/browser/controller/contentEditable";
import { CellViewModel } from "../../workbench/contrib/notebook/browser/viewModel/notebookViewModel";
import { Selectable } from "mote/editor/browser/controller/selectable";
import { localize } from "vs/nls";
import { useState } from "react";

export const TextCell = (props: { cell: CellViewModel }) => {

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
        //console.log('getHtml', title)
        return title;
    }

    const placeholder = localize('notebookCell.placeholder', "Wrtie something or type `/` for commands");
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
};