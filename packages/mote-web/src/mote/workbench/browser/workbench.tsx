import { Drawer } from 'mote/base/component/drawer/drawer';
import { TitlebarPart } from 'mote/base/component/titlebar/titlebarPart';
import { Sidebar } from 'mote/workbench/contrib/explorer/sidebar';

export const Workbench = () => {
    return (
        <>
        <Drawer open>
            <div>
                <h1>Workbench</h1>
            </div>
        </Drawer>
        <TitlebarPart />
        <div style={{display: 'flex'}}>
            <Sidebar />
            <div>
                <h1>Workbench</h1>
            </div>
        </div>
        </>
    );
}