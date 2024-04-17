import { Input } from '@nextui-org/react';
import { WorkbenchToolbar } from './titlebarAction';

import './titlebarPart.css';

export const Titlebar = () => {
    return (
        <div className='titlebar'>
            <div>
                <img src='/mote-512.png' style={{marginLeft: 15, height: 38, width: 43}}/>
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