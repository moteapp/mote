import { Drawer } from 'mote/base/component/drawer/drawer';
import { TitlebarPart } from 'mote/base/component/titlebar/titlebarPart';
import { MoteEditor } from 'mote/editor/browser/moteEditor';
import { Sidebar } from 'mote/workbench/contrib/explorer/sidebar';
import {Card, CardBody} from '@nextui-org/react';
import { instantiationService } from './web.factory';
import { QuickNote } from 'mote/base/component/quicknote/quicknote';

export const Workbench = () => {
    instantiationService.invokeFunction((accessor) => {
        console.log(accessor);
    });
    return (
        <>
        <Drawer open>
            <div>
                <h1>Workbench</h1>
            </div>
        </Drawer>
        <TitlebarPart />
        <div style={{display: 'flex', flex: '1'}}>
            <Sidebar />
            <div style={{display: 'flex', flex: '1', justifyContent: 'center'}}>
                <div style={{height: '20vh', marginTop: '25px'}}>
                    <QuickNote />
                </div>
            </div>
        </div>
        </>
    );
}