import { ForwardedRef, ReactNode, forwardRef } from "react";
import styled, { DefaultTheme } from "styled-components";
import Flex from "./flex";
import { s } from "mote/app/styles/theme";
import { breakpoint } from "mote/app/styles/breakpoint";
import { MenuProvider } from "@ariakit/react";
import { SkipNavContent } from "./skipNav";

export interface ILayoutProps {
    title?: string;
    sidebar?: ReactNode;
    sidebarRight?: ReactNode;
    children: ReactNode;
}

export const Layout = forwardRef(function _Layout(
    props: ILayoutProps, ref: ForwardedRef<HTMLDivElement>
) {
    const { title, sidebar, sidebarRight, children } = props;

    return (
        <Container $column $auto ref={ref}>
            <Container $auto>
                <MenuProvider>
                    {sidebar}
                </MenuProvider>
                <SkipNavContent />
                <Content 
                    $auto
                    justify="center"
                    style={{
                        marginLeft: 260
                    }}
                >
                    {children}
                </Content>

                {sidebarRight}
            </Container>
        </Container>
    )
});

const Container = styled(Flex)`
  background: ${s("background")};
  transition: ${s("backgroundTransition")};
  position: relative;
  width: 100%;
  min-height: 100%;
`;

type ContentProps = {
    $isResizing?: boolean;
    $sidebarCollapsed?: boolean;
    $hasSidebar?: boolean;
};
  
const Content = styled(Flex)<ContentProps>`
    margin: 0;
    transition: ${(props) =>
      props.$isResizing ? "none" : `margin-left 100ms ease-out`};
  
    @media print {
      margin: 0 !important;
    }
  
    ${breakpoint("mobile", "tablet")`
      margin-left: 0 !important;
    `}
  
    ${breakpoint("tablet")`
      ${(props:any) =>
        props.$hasSidebar &&
        props.$sidebarCollapsed &&
        `margin-left: ${props.theme.sidebarCollapsedWidth}px;`}
    `};
`;