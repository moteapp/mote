import { breakpoint } from "mote/app/styles/breakpoint";
import { s } from "mote/app/styles/theme";
import { ReactNode, forwardRef, useMemo } from "react";
import styled, { css, useTheme } from "styled-components";
import { SidebarNavLink } from "./sidebarNavLink";
import { NudeButton } from "mote/base/components/buttton/budeButton";
import { EventBoundary } from "mote/base/components/eventBoundary";
import { StyledDisclosure } from "./disclosure";

export interface ISidebarLinkProps {
    to?: string;
    icon?: React.ReactNode;
    exact?: boolean;
    label?: ReactNode;
    onClick?: React.MouseEventHandler<HTMLElement>;
}

export const SidebarLink = forwardRef(function _SidebarLink({
    to,
    icon,
    exact,
    label,
    onClick
}: ISidebarLinkProps, ref: any){

    const theme = useTheme();

    const activeStyle = useMemo(()=>({
        fontWeight: 600,
        color: theme.text,
        background: theme.sidebarActiveBackground,
    }), [theme.text, theme.sidebarActiveBackground]);

    return (
        <>
            <Link 
                to={to!}
                as={to ? undefined : "div"}
                activeStyle={activeStyle}
                onClick={onClick}
            >
                <Content>
                    {icon && <IconWrapper>{icon}</IconWrapper>}
                    <Label>{label}</Label>
                </Content>
            </Link>
        </>
    )
});

const Content = styled.span`
  display: flex;
  align-items: start;
  position: relative;
  width: 100%;

  ${StyledDisclosure} {
    margin-top: 2px;
    margin-left: 2px;
  }
`;

const Label = styled.div`
  position: relative;
  width: 100%;
  max-height: 4.8em;
  line-height: 24px;

  * {
    unicode-bidi: plaintext;
  }
`;

// accounts for whitespace around icon
export const IconWrapper = styled.span`
  margin-left: -4px;
  margin-right: 4px;
  height: 24px;
  overflow: hidden;
  flex-shrink: 0;
`;

const Actions = styled(EventBoundary as any)<{ showActions?: boolean }>`
  display: inline-flex;
  visibility: ${(props) => (props.showActions ? "visible" : "hidden")};
  position: absolute;
  top: 4px;
  right: 4px;
  gap: 4px;
  color: ${s("textTertiary")};
  transition: opacity 50ms;
  height: 24px;

  svg {
    color: ${s("textSecondary")};
    fill: currentColor;
    opacity: 0.5;
  }

  &:hover {
    visibility: visible;

    svg {
      opacity: 0.75;
    }
  }
`;

const Link = styled(SidebarNavLink)<{
    $isActiveDrop?: boolean;
    $isDraft?: boolean;
    $disabled?: boolean;
  }>`
    display: flex;
    position: relative;
    text-overflow: ellipsis;
    padding: 6px 16px;
    border-radius: 4px;
    min-height: 32px;
    transition: background 50ms, color 50ms;
    user-select: none;
    background: ${(props) =>
      props.$isActiveDrop ? props.theme.slateDark : "inherit"};
    color: ${(props) =>
      props.$isActiveDrop ? props.theme.white : props.theme.sidebarText};
    font-size: 16px;
    cursor: var(--pointer);
    overflow: hidden;
  
    ${(props) =>
      props.$disabled &&
      css`
        pointer-events: none;
        opacity: 0.75;
      `}
  
    ${(props) =>
      props.$isDraft &&
      css`
        &:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          border-radius: 4px;
          border: 1.5px dashed ${props.theme.sidebarDraftBorder};
        }
      `}
  
    svg {
      ${(props) => (props.$isActiveDrop ? `fill: ${props.theme.white};` : "")}
      transition: fill 50ms;
    }
  
    &:hover svg {
      display: inline;
    }
  
    & + ${Actions} {
      background: ${s("sidebarBackground")};
  
      ${NudeButton} {
        background: transparent;
  
        &:hover,
        &[aria-expanded="true"] {
          background: ${s("sidebarControlHoverBackground")};
        }
      }
    }
  
    &[aria-current="page"] + ${Actions} {
      background: ${s("sidebarActiveBackground")};
    }
  
    ${breakpoint("tablet")`
      padding: 4px 8px 4px 16px;
      font-size: 14px;
    `}
  
    @media (hover: hover) {
      &:hover + ${Actions}, &:active + ${Actions} {
        visibility: visible;
  
        svg {
          opacity: 0.75;
        }
      }
  
      &:hover {
        color: ${(props) =>
          props.$isActiveDrop ? props.theme.white : props.theme.text};
      }
    }
  
    &:hover {
      ${StyledDisclosure} {
        opacity: 1;
      }
    }
`;