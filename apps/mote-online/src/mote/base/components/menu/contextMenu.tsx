import { Menu } from "@ariakit/react"
import { breakpoint } from "mote/app/styles/breakpoint"
import styled, { DefaultTheme, css } from "styled-components"
import { Scrollable } from "../scrollable"
import { fadeAndSlideDown, fadeAndSlideUp, mobileContextMenu } from "mote/app/styles/animations"
import { s } from "mote/app/styles/theme"
import { depths } from "mote/app/styles/styles"
import { ReactNode } from "react"

export interface IContextMenuProps {
    children?: ReactNode;
}

export interface IInnerContextMenuProps {
    children?: ReactNode;
}

const InnerContextMenuProps = ({
    children
}: IInnerContextMenuProps) => {
    return (
        <Position>
            <Background
            >
                {children}
            </Background>
        </Position>
    )

}

export const ContextMenu = ({
    children
}: IContextMenuProps) => {
    return (
        <Menu>
           
            <InnerContextMenuProps >
                {children}
            </InnerContextMenuProps>
          
        </Menu>
    )
}

export const Position = styled.div`
  position: absolute;
  z-index: ${depths.menu};

  /*
   * overrides make mobile-first coding style challenging
   * so we explicitly define mobile breakpoint here
   */
  ${breakpoint("mobile", "tablet")`
    position: fixed !important;
    transform: none !important;
    top: auto !important;
    right: 8px !important;
    bottom: 16px !important;
    left: 8px !important;
  `};
`;

type BackgroundProps = {
    topAnchor?: boolean;
    rightAnchor?: boolean;
    maxWidth?: number;
    theme: DefaultTheme;
  };
  
  export const Background = styled(Scrollable)<BackgroundProps>`
    animation: ${mobileContextMenu} 200ms ease;
    transform-origin: 50% 100%;
    max-width: 100%;
    background: ${s("menuBackground")};
    border-radius: 6px;
    padding: 6px;
    min-width: 180px;
    min-height: 44px;
    max-height: 75vh;
    pointer-events: all;
    font-weight: normal;
  
    @media print {
      display: none;
    }
  
    ${breakpoint("tablet")`
        animation: ${(props:any) =>
            props.topAnchor ? css`${fadeAndSlideDown}` as any : css`${fadeAndSlideUp}`} 200ms ease;
        transform-origin: ${(props: any) =>
            props.rightAnchor ? "75%" : "25%"} 0;
        max-width: ${(props: any) => props.maxWidth ?? 276}px;
        max-height: 100vh;
        background: ${(props: any) => props.theme.menuBackground};
        box-shadow: ${(props: any) => props.theme.menuShadow};
    `};
`;