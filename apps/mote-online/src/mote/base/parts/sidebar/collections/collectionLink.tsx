import { ICollectionModel } from "@mote/client/model/model";
import styled from "styled-components";
import { SidebarLink } from "../sidebarLink";
import { EditableTitle } from "../editableTitle";

export interface ICollectionLinkProps {
    collection: ICollectionModel;
}

export const CollectionLink = ({
    collection
}: ICollectionLinkProps) => {
    
    return (
        <Relative>
            <SidebarLink 
                to={`/collection/${collection.id}`}
                label={<EditableTitle title={collection.name} />}
            />
        </Relative>
    )
}


const Relative = styled.div`
  position: relative;
`;