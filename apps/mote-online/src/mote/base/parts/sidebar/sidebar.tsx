import { breakpoint } from "mote/app/styles/breakpoint";
import { depths } from "mote/app/styles/styles";
import Flex from "mote/base/components/flex";
import { ForwardedRef, forwardRef, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { s } from "mote/app/styles/theme";
import { ToggleButton } from "./toggleSidebarButton";

export interface ISidebarProps {

}

export const Sidebar = forwardRef(function _Sidebar(
    {
        
    }: ISidebarProps,
    ref: ForwardedRef<HTMLDivElement>
){

    const [isAnimating, setAnimating] = useState(false);
    const [isHovering, setHovering] = useState(false);  

    const theme = useTheme();
    const maxWidth = theme.sidebarMaxWidth;
    const minWidth = theme.sidebarMinWidth + 16; // padding

    const width = 300;
    const isSmallerThanMinimum = width < minWidth;

    return (
        <>
            <Container 
                ref={ref}
                $isAnimating={isAnimating}
                $isHovering={isHovering}
                $isSmallerThanMinimum={isSmallerThanMinimum}
                $mobileSidebarVisible={false}
                $collapsed={false}
            >

            </Container>
        </>
    )
});

type ContainerProps = {
    $mobileSidebarVisible: boolean;
    $isAnimating: boolean;
    $isSmallerThanMinimum: boolean;
    $isHovering: boolean;
    $collapsed: boolean;
};

const ANIMATION_MS = 250;

const hoverStyles = (props: any) => `
  transform: none;
  box-shadow: ${
    props.$collapsed
      ? "rgba(0, 0, 0, 0.2) 1px 0 4px"
      : props.$isSmallerThanMinimum
      ? "rgba(0, 0, 0, 0.1) inset -1px 0 2px"
      : "none"
  };

  ${ToggleButton} {
    opacity: 1;
  }
`;

const Container = styled(Flex)<ContainerProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background: ${s("sidebarBackground")};
  transition: box-shadow 100ms ease-in-out, opacity 100ms ease-in-out,
    transform 100ms ease-out,
    ${s("backgroundTransition")}
      ${(props: ContainerProps) =>
        props.$isAnimating ? `,width ${ANIMATION_MS}ms ease-out` : ""};
  transform: translateX(
    ${(props) => (props.$mobileSidebarVisible ? 0 : "-100%")}
  );
  z-index: ${depths.mobileSidebar};
  max-width: 80%;
  min-width: 280px;

  @media print {
    display: none;
    transform: none;
  }

  & > div {
    opacity: ${(props) => (props.$collapsed && !props.$isHovering ? "0" : "1")};
  }

  ${breakpoint("tablet")`
    z-index: ${depths.sidebar};
    margin: 0;
    min-width: 0;
    transform: translateX(${(props: any) =>
      props.$collapsed
        ? `calc(-100% + 16px)`
        : 0});

    ${(props: any) => props.$isHovering && css(hoverStyles)}

    &:hover {
      ${ToggleButton} {
        opacity: 1;
      }
    }

    &:focus-within {
      ${hoverStyles}

      & > div {
        opacity: 1;
      }    
    }
  `};
`;