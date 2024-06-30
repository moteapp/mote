import styled from "styled-components";
import { Text } from "mote/base/components/text";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./sidebar";
import { OrganizationMenu } from "./organizationMenu";
import { Scrollable } from "mote/base/components/scrollable";
import { ISidebarButtonProps, SidebarButton } from "./sidebarButton";
import { TeamLogo } from "mote/base/components/avatar";
import { color } from "framer-motion";
import { Section } from "mote/base/components/flex";
import { SidebarLink } from "./sidebarLink";
import { SVGIcon } from "mote/base/components/icon/svgIcon";
import { Collections } from "./collections/collections";

export const SidebarPart = () => {
    const { t } = useTranslation();

    const team = {
        name: 'Wiki',
        initial: 'W',
        color: '#2BC2FF'
    }

    return (
        <Sidebar>
            <OrganizationMenu>
                <SidebarButton 
                    title={team.name}
                    image={
                        <TeamLogo
                          model={team}
                          size={24}
                          alt={t("Logo")}
                          style={{ marginLeft: 4 }}
                        />
                    }
                >

                </SidebarButton>
            </OrganizationMenu>
            <Scrollable flex shadow>
                <Section>
                    <SidebarLink
                        to={'/home'}
                        icon={<SVGIcon name="home" />}
                        exact={false}
                        label={t("Home")}
                    />
                </Section>
                <Section $auto>
                    <Collections />
                </Section>
            </Scrollable>
        </Sidebar>
    )
};

const Drafts = styled(Text)`
  margin: 0 4px;
`;