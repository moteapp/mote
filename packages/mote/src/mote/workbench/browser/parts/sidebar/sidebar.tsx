import { localize } from "mote/base/common/i18n"
import { Section } from "./section"

import './sidebar.css'
import { SpaceModel, SpaceRootModel } from "mote/platform/record/common/spaceModel"
import { useAppSelector } from "mote/app/hooks"
import { selectUser } from "mote/app/slice/user/userSlice"
import { selectRecord } from "mote/app/slice/records/recordSlice"
import { store } from "mote/app/store"
import type { IPointer } from "mote/platform/record/common/recordCommon"

export const SidebarPart = () => {
    const user = useAppSelector(selectUser);

    const recordProvider = {
        provideRecord: (pointer: IPointer) => selectRecord(store.getState(), pointer.id).record
    };
    const spaceRootModel = new SpaceRootModel({
        id: user.id,
        table: 'space_root',
    }, recordProvider);

    const spaceModel = spaceRootModel.spaces[0];

    return (
        <div className="sidebar">
            <div style={{padding: '6px 8px 20px'}}>
            <PrivateSection spaceModel={spaceModel}/>
            </div>
        </div>
    )
}

interface IPrivateSectionProps {
    spaceModel: SpaceModel;
}

const PrivateSection = (props: IPrivateSectionProps) => {
    return (
        <div className="private-section">
            <Section title={localize('sidebar.private', 'Private')} />
        </div>
    )
}