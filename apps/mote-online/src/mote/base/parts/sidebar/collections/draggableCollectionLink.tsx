import { ICollectionModel } from "@mote/client/model/model";
import styled from "styled-components";
import { CollectionLink } from "./collectionLink";

export interface IDraggableCollectionLinkProps {
    collection: ICollectionModel;
}

export const DraggableCollectionLink = ({
    collection
}: IDraggableCollectionLinkProps) => {

    return (
        <>
            <Draggable 
                key={collection.id}
                $isDragging={false}
            >
                <CollectionLink 
                    collection={collection}
                />
            </Draggable>
        </>
    )
};

const Draggable = styled("div")<{ $isDragging: boolean }>`
  transition: opacity 250ms ease;
  opacity: ${(props) => (props.$isDragging ? 0.1 : 1)};
  pointer-events: ${(props) => (props.$isDragging ? "none" : "auto")};
`;