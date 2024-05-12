import { useAppDispatch, useAppSelector } from 'mote/app/hooks';
import { EditorPart } from './parts/editor/editorPart';
import { SidebarPart } from './parts/sidebar/sidebar';

import './workbench.css';
import { createUser, selectUser } from 'mote/app/slice/user/userSlice';
import { useEffect } from 'react';

export const Workbench = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!user.id) {
            dispatch(createUser());
        }
    });

    if (!user.id) {
        return <div>Loading</div>
    }

    return (
        <div className='workbench'>
            <SidebarPart />
            <EditorPart />
        </div>
    )
}