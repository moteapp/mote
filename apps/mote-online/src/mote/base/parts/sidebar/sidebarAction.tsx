import { IAction } from "mote/base/common/actions"
import { SidebarLink } from "./sidebarLink"
import { useTranslation } from "react-i18next";

export interface ISidebarActionProps {
    action: IAction;
}

export const SidebarAction = ({
    action
}: ISidebarActionProps) => {
    const { t } = useTranslation();
    const handleClick = () => {
        action.run();
    }
    
    return (
        <SidebarLink 
            onClick={handleClick}
            label={t(action.label)}
            icon={action.icon}
        />
    )
}