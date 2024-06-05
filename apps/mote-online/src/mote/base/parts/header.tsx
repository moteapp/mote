import { breakpoint } from "mote/app/styles/breakpoint";
import { transparentize } from "polished";
import styled from "styled-components";
import Flex from "../components/flex";
import { s } from 'mote/app/styles/theme';
import { depths } from "mote/app/styles/styles";

export const Header = () => {
    return (
        <Wrapper
            align="center"
            shrink={false}
        >

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