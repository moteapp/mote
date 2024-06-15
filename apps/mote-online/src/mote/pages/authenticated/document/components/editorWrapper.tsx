import { EditorWidget } from "mote/editor/editorWidget";


export interface IEditorWidgetProps {
    placeholder: string;
}

export const EditorWrapper = ({
    
    ...restProps
}: IEditorWidgetProps) => {
    return (
        <EditorWidget
            defaultValue={""}
            {...restProps}
        />
    )
}