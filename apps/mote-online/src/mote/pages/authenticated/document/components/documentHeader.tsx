import { IBlockRecord } from "@mote/editor/common/recordCommon";
import { Header } from "mote/base/parts/header";
import styled, { css } from "styled-components";

export interface IDocumentHeaderProps {
    document: IBlockRecord
}

export const DocumentHeader = ({
    document,
}: IDocumentHeaderProps) => {

    const DocumentTitle = () => {
        return (
            <>
                {document.title}{" "}
            </>
        )
    }

    return (
        <StyledHeader
            $hidden = {false}
            title={<DocumentTitle />}
        />
    )
}

const StyledHeader = styled(Header)<{ $hidden: boolean }>`
  transition: opacity 500ms ease-in-out;
  ${(props) => props.$hidden && "opacity: 0;"}
`;

