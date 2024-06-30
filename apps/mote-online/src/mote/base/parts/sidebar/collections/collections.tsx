import Flex from "mote/base/components/flex"
import { useTranslation } from "react-i18next"
import { SectionHeader } from "../sectionHeader";
import styled from "styled-components";
import { PaginatedList } from "mote/base/components/list/paginatedList";
import { SidebarAction } from "../sidebarAction";
import { SVGIcon } from "mote/base/components/icon/svgIcon";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import * as Ariakit from "@ariakit/react";
import { NewCollection } from "./newCollection";
import { depths } from "mote/app/styles/styles";
import { breakpoint } from "mote/app/styles/breakpoint";
import { useAppDispatch, useAppSelector } from "mote/app/hooks";
import { fetchCollections, selectCollections } from "mote/app/slices/collections/collectionsSlice";
import { DraggableCollectionLink } from "./draggableCollectionLink";


export const Collections = () => {
    const { t } = useTranslation();
    const [showDialog, setShowDialog] = useState(false);

    const collections = useAppSelector(selectCollections);
    const dispatch = useAppDispatch();

    const createCollectionAction = {
        label: "New collection",
        icon: <SVGIcon name="plus" size={16}/>,
        run: () => {
            setShowDialog(true);
        }
    }

    useEffect(() => {
        dispatch(fetchCollections());
    }, [])

    return (
        <Flex $column>
            <SectionHeader id="collections" title={t("Collections")}></SectionHeader>
            <Relative>
                <PaginatedList
                    items={collections}
                    renderItem={(collection) => (
                        <DraggableCollectionLink collection={collection}/>
                    )}
                />
                <SidebarAction action={createCollectionAction}/>
            </Relative>
            {showDialog && createPortal(
                <Dialog 
                    className="dialog"
                    open={showDialog}
                    onClose={() => setShowDialog(false)}
                    backdrop={<Background />}
                >
                    <DialogHead>
                        {t("Create a collection")}
                    </DialogHead>
                    <NewCollection />
                </Dialog>,
                document.body
            )}
        </Flex>
    )
}

const Relative = styled.div`
  position: relative;
`;

const Background = styled.div`
    background-color: rgb(0 0 0 / 0.1);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0;
    transition-property: opacity, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    backdrop-filter: blur(0);
`;

const DialogHead = styled(Ariakit.DialogHeading)`
    margin: 0px;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
`

const Dialog = styled(Ariakit.Dialog)`
    position: fixed;
    inset: 0.75rem;
    z-index: ${depths.modal};
    margin: auto;
    display: flex;
    height: fit-content;
    max-height: calc(100dvh - 2 * 0.75rem);
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    border-radius: 0.75rem;
    background-color: white;
    padding: 1rem;
    color: black;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

    ${breakpoint("tablet")`
        width: 420px;
    `};
`