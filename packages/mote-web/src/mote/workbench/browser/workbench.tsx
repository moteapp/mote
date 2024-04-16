import { Drawer } from 'mote/base/component/drawer/drawer';
import { TitlebarPart } from 'mote/base/component/titlebar/titlebarPart';
import { MoteEditor } from 'mote/editor/browser/moteEditor';
import { Sidebar } from 'mote/workbench/contrib/explorer/sidebar';
import {Card, CardBody} from '@nextui-org/react';

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
            <div style={{width: 'calc(100vh-280)'}}>
                <Card>
                    <CardBody>
                        <MoteEditor />
                    </CardBody>
                </Card>
            </div>
        </div>
        </>
    );
}