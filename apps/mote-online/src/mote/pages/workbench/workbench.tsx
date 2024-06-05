import { Explorer } from "mote/base/components/explorer/explorer"
import { EditorPart } from "./parts/editor/editorPart"
import { SidebarPart } from "./parts/sidebar/sidebarPart"

export const Workbench = () => {
    return (

        <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
            <SidebarPart />
            <EditorPart />
        </div>
    )
}