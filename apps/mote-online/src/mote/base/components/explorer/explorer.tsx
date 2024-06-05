import { SVGIcon } from 'mote/base/components/icon/svgIcon';
import './explorer.css';
import { useState } from 'react';

interface SectionActionProps {
    show: boolean;
}

const SectionAction = (props: SectionActionProps) => {
    const [hoverd, setHovered] = useState(false);
    return (
        <div className='section-action-container'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{opacity: props.show ? 1 : 0, pointerEvents: props.show ? 'auto' : 'none'}}
        >
            <div className='section-action' style={{background: hoverd ? '#37352f14': ''}}>
                <SVGIcon name='plus' fill='#37352f73'/>
            </div>
        </div>
    )
}

const SectionHeader = () => {
    const [hoverd, setHovered] = useState(false);

    return (
        <div role='button' className='section-header'
            style={{backgroundColor: hoverd ? 'rgba(0, 0, 0, 0.04)' : 'transparent'}}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            >
            <span className='section-header-title'
                style={{color: hoverd ? 'rgba(55, 53, 47, 1)' : ''}}
            >
                Explorer
            </span>
            <div style={{marginLeft: 'auto'}}>
                <SectionAction show={hoverd}/>
            </div>
        </div>
    )
}

export const Explorer = () => {
    return (
        <div style={{paddingLeft: 12, paddingRight: 12, marginTop: 20}}>
            <SectionHeader />
        </div>
    )
}