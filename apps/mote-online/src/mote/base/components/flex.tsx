import { CSSProperties } from 'react';
import styled from "styled-components";

type JustifyValues = CSSProperties["justifyContent"];

type AlignValues = CSSProperties["alignItems"];

export const Flex = styled.div<{
  auto?: boolean;
  column?: boolean;
  align?: AlignValues;
  justify?: JustifyValues;
  wrap?: boolean;
  shrink?: boolean;
  reverse?: boolean;
  gap?: number;
}>`
  display: flex;
  flex: ${({ auto }) => (auto ? "1 1 auto" : "initial")};
  flex-direction: ${({ column, reverse }) =>
    reverse
      ? column
        ? "column-reverse"
        : "row-reverse"
      : column
      ? "column"
      : "row"};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "initial")};
  flex-shrink: ${({ shrink }) =>
    shrink === true ? 1 : shrink === false ? 0 : "initial"};
  gap: ${({ gap }) => (gap ? `${gap}px` : "initial")};
  min-height: 0;
  min-width: 0;
`;

export const Section = styled(Flex)`
  position: relative;
  flex-direction: column;
  margin: 0 8px 12px;
  min-width: ${(props) => props.theme.sidebarMinWidth}px;
  flex-shrink: 0;

  &:first-child {
    margin-top: 20px;
  }

  &:empty {
    display: none;
  }
`;

export const Container = styled(Flex)`
  position: relative;
`;

export default Flex;
