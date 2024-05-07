import { localize } from "mote/base/common/i18n"
import { Section } from "./section"

import './sidebar.css'

export const SidebarPart = () => {
    return (
        <div className="sidebar">
            <div style={{padding: '6px 8px 20px'}}>
            <PrivateSection />
            </div>
        </div>
    )
}

const PrivateSection = () => {
    return (
        <div className="private-section">
            <Section title={localize('sidebar.private', 'Private')} />
        </div>
    )
}