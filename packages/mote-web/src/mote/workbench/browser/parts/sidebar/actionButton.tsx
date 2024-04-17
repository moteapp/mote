import { SVGIcon } from 'mote/base/component/icon/svgIcon';

import './actionButton.css';
import { useState } from 'react';
import { instantiationService } from 'mote/workbench/browser/web.main';
import { NewEmptyEditorWindowAction } from 'mote/workbench/browser/parts/editor/editorActions';

interface ActionButtonProps {
    visible: boolean;
}

export const ActionButton = (props: ActionButtonProps ) => {
    const [hovered, setHovered] = useState(false);

    const handleAddPage = () => {
        instantiationService.invokeFunction((accessor) => {
            new NewEmptyEditorWindowAction().run(accessor);
        });
    }

    return (
        <div className='sidebar-action-container'
            style={{opacity: props.visible ? 1 : 0, pointerEvents: props.visible ? 'auto' : 'none'}}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div role='button' 
                className='sidebar-action'
                style={{background: hovered ? '#37352f14' : ''}}
                onClick={handleAddPage}
            >
                <span></span>
                <SVGIcon name='plus' />
            </div>
        </div>
    )
}