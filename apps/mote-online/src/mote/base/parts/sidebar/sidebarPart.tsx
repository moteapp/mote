import styled from "styled-components";
import { Text } from "mote/base/components/text";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./sidebar";

export const SidebarPart = () => {
    const { t } = useTranslation();

    return (
        <Sidebar>
            
        </Sidebar>
    )
};

const Drafts = styled(Text)`
  margin: 0 4px;
`;