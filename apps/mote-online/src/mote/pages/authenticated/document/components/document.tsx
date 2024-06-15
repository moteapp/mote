import Flex, { Container } from "mote/base/components/flex";
import styled from "styled-components";
import { s } from "mote/app/styles/theme";
import { IBlockRecord } from "@mote/editor/common/recordCommon";
import { PageTitle } from "mote/base/components/page";
import { DocumentHeader } from "./documentHeader";
import { breakpoint } from "mote/app/styles/breakpoint";
import { Suspense } from "react";
import { DocumentPlaceholder } from "mote/base/components/document/documentPlaceholder";
import { DocumentEditor } from "./documentEditor";

export interface IDocumentProps {
    revision?: any;
    document: IBlockRecord
}

export const Document = ({
    revision,
    document,
}: IDocumentProps) => {

    const readOnly = false;

    return (
        <Background
          id="full-width-container"
          key={revision ? revision.id : document.id}
          column
          auto
        >
            <PageTitle
                title={document.title}
            />
            <Container justify="center" column auto>
                <DocumentHeader document={document}/>
                <MaxWidth 
                    column
                    auto
                >
                    <Suspense fallback={<DocumentPlaceholder />} >
                        <Flex auto={!readOnly} reverse>
                            <DocumentEditor />
                        </Flex>
                    </Suspense>
                </MaxWidth>
            </Container>
        </Background>
    );
};

const Background = styled(Container)`
  position: relative;
  background: ${s("background")};
  transition: ${s("backgroundTransition")};
`;

type MaxWidthProps = {
    isEditing?: boolean;
    isFullWidth?: boolean;
    archived?: boolean;
    showContents?: boolean;
  };
  
  const MaxWidth = styled(Flex)<MaxWidthProps>`
    // Adds space to the gutter to make room for heading annotations
    padding: 0 32px;
    transition: padding 100ms;
    max-width: 100vw;
    width: 100%;
  
    padding-bottom: 16px;
  
    ${breakpoint("tablet")`
      margin: 4px auto 12px;
      max-width: ${(props: MaxWidthProps) =>
        props.isFullWidth
          ? "100vw"
          : `calc(64px + 46em + ${props.showContents ? "256px" : "0px"});`}
    `};
  
    ${breakpoint("desktopLarge")`
      max-width: ${(props: MaxWidthProps) =>
        props.isFullWidth ? "100vw" : `calc(64px + 52em);`}
    `};
`;