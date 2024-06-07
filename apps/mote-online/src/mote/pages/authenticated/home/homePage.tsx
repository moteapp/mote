import { s } from "mote/app/styles/theme";
import { Action } from "mote/base/components/actions";
import { NewDocumentButton } from "mote/base/components/document/newDocument";
import { PaginatedDocuments } from "mote/base/components/document/paginatedDocuments";
import Heading from "mote/base/components/heading";
import { Page } from "mote/base/components/page"
import { Tab } from "mote/base/components/tab/tab";
import { Tabs } from "mote/base/components/tab/tabs";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";



export const HomePage = () => {
    const { t } = useTranslation();
    return (
        <Page 
            title={t("Home")}
            actions={
                <Action>
                    <NewDocumentButton />
                </Action>
            }
        >
            <Heading>{t("Home")}</Heading>
            <Documents>
                <Tabs>
                    <Tab to="/home" exact>
                        {t("Recently viewed")}
                    </Tab>
                    <Tab to="/home/recent" exact>
                        {t("Recently updated")}
                    </Tab>
                </Tabs>
                <Routes>
                    <Route path="/recent" element={ <PaginatedDocuments />} />
                    <Route path="/created" element={ <PaginatedDocuments />} />
                </Routes>
            </Documents>
        </Page>
    )
}

const Documents = styled.div`
  position: relative;
  background: ${s("background")};
  transition: ${s("backgroundTransition")};
`;