import { useState } from 'react';
import { SVGIcon } from 'mote/base/component/svgIcon/svgIcon'
import './section.css'

export interface SectionProps {
    title: string
}

interface SectionActionProps {
    visible: boolean;
}

const SectionActions = (props: SectionActionProps) => {
    const [hoverd, setHovered] = useState(false);
    return (
        <div style={{marginLeft: 'auto'}}>
            <div className='action-container' 
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{opacity: props.visible ? 1 : 0, pointerEvents: props.visible ? 'auto' : 'none'}}
            >
                <div className='action' role='button' style={{background: hoverd ? '#37352f14': ''}}>
                    <SVGIcon name='plus' fill='#37352f73'/>
                </div>
            </div>
        </div>
    )
}

export const Section = (props: SectionProps) => {
    const [hoverd, setHovered] = useState(false);
    return (
        <div role='button' className='section'
            style={{backgroundColor: hoverd ? 'rgba(0, 0, 0, 0.04)' : 'transparent'}}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span className='title'
                style={{color: hoverd ? 'rgba(55, 53, 47, 1)' : ''}}
            >
                {props.title}
            </span>
            <SectionActions visible={hoverd}/>
        </div>
    )
}