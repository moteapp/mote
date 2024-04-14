import { Input } from '@nextui-org/react';
import { WorkbenchToolbar } from './titlebarAction';

import './titlebarPart.css';

export const TitlebarPart = () => {
    return (
        <div className='titlebar'>
            <div>
                <img src='/mote-192.png' style={{marginLeft: 15, height: 43, width: 43}}/>
            </div>
            <div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input placeholder='Search...' />
                </div>
            </div>
            <div>
                <WorkbenchToolbar />
            </div>
        </div>
    );
}