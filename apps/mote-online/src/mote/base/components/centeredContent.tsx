import { breakpoint } from "mote/app/styles/breakpoint";
import { ReactNode } from "react"
import styled from "styled-components";

export interface ICenteredContentProps {
    children?: ReactNode;
    maxWidth?: string;
    withStickyHeader?: boolean;
}

export const CenteredContent = ({
    children, maxWidth, withStickyHeader
}: ICenteredContentProps) => {
    return (
        <Container withStickyHeader={withStickyHeader}>
            <Content $maxWidth={maxWidth}>{children}</Content>
        </Container>
    )
}

const Container = styled.div<ICenteredContentProps>`
  width: 100%;
  max-width: 100vw;
  padding: ${(props) => (props.withStickyHeader ? "4px 12px" : "60px 12px")};

  ${breakpoint("tablet")`
    padding: ${(props: ICenteredContentProps) =>
      props.withStickyHeader ? "4px 44px 60px" : "60px 44px"};
  `};
`;

type ContentProps = { $maxWidth?: string };

const Content = styled.div<ContentProps>`
  max-width: ${(props) => props.$maxWidth ?? "46em"};
  margin: 0 auto;

  ${breakpoint("desktopLarge")`
    max-width: ${(props: ContentProps) => props.$maxWidth ?? "52em"};
  `};
`;