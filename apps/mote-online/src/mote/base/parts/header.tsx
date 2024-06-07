import { breakpoint } from "mote/app/styles/breakpoint";
import { transparentize } from "polished";
import styled from "styled-components";
import Flex from "../components/flex";
import { s } from 'mote/app/styles/theme';
import { depths } from "mote/app/styles/styles";
import { ReactNode } from "react";
import { useIsMobile } from "mote/app/hooks/useIsMobile";

export interface IHeaderProps {
    left?: ReactNode;
    actions?: ReactNode;
    hasSidebar?: boolean;
}

export const Header = ({ left, actions, hasSidebar }: IHeaderProps) => {
    const isMobile = useIsMobile();
    const hasMobileSidebar = hasSidebar && isMobile;

    return (
        <Wrapper
            align="center"
            shrink={false}
        >
            {left || hasMobileSidebar ? (
                <Breadcrumbs>
                    {left}
                </Breadcrumbs>
            ) : null}

            <Actions align="center" justify="flex-end">
                {actions}
            </Actions>
        </Wrapper>
    )
}

const Breadcrumbs = styled("div")`
    flex-grow: 1;
    flex-basis: 0;
    align-items: center;
    padding-right: 8px;
    display: flex;
`;

const Actions = styled(Flex)`
  flex-grow: 1;
  flex-basis: 0;
  min-width: auto;
  padding-left: 8px;

  ${breakpoint("tablet")`
    position: unset;
  `};
`;

interface WrapperProps {
    $passThrough?: boolean;
    $insetTitleAdjust?: boolean;
};

const Wrapper = styled(Flex)<WrapperProps>`
  top: 0;
  z-index: ${depths.header};
  position: sticky;
  background: ${s("background")};

  ${(props) =>
    props.$passThrough
      ? `
      background: transparent;
      pointer-events: none;
      `
      : `
      background: ${transparentize(0.2, props.theme.background)};
      backdrop-filter: blur(20px);
      `};

  padding: 12px;
  transition: all 100ms ease-out;
  transform: translate3d(0, 0, 0);
  min-height: 64px;
  justify-content: flex-start;


  @supports (backdrop-filter: blur(20px)) {
    backdrop-filter: blur(20px);
    background: ${(props) => transparentize(0.2, props.theme.background)};
  }

  @media print {
    display: none;
  }

  ${breakpoint("tablet")`
    padding: 16px;
    justify-content: center;
    ${(props: WrapperProps) => props.$insetTitleAdjust && `padding-left: 64px;`}
    `};
`;