import { EditorPart } from './parts/editor/editorPart';
import { SidebarPart } from './parts/sidebar/sidebar';

import './workbench.css';

export const Workbench = () => {
    return (
        <div className='workbench'>
            <SidebarPart />
            <EditorPart />
        </div>
    )
}