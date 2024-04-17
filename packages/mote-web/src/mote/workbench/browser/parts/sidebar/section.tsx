
import './section.css';
import { ActionButton } from './actionButton';
import { useState } from 'react';

export const Section = () => {

    const [hovered, setHovered] = useState(false);

    return (
        <div className='section-header'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{display: 'flex', flex: 1}}>
                <div role='button'>
                    <span>Private</span>
                </div>
            </div>
            <div className='section-header-right'>
                <ActionButton visible={hovered}/>
            </div>
        </div>
    )
}