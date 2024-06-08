import styled from "styled-components";
import { Text } from "mote/base/components/text";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./sidebar";
import { OrganizationMenu } from "./organizationMenu";
import { Scrollable } from "mote/base/components/scrollable";

export const SidebarPart = () => {
    const { t } = useTranslation();

    return (
        <Sidebar>
            <OrganizationMenu>
                
            </OrganizationMenu>
            <Scrollable flex shadow>
                
            </Scrollable>
        </Sidebar>
    )
};

const Drafts = styled(Text)`
  margin: 0 4px;
`;