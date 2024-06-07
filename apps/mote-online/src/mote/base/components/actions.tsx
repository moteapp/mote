import styled from "styled-components";
import Flex from "./flex";
import { breakpoint } from "mote/app/styles/breakpoint";
import { s } from "mote/app/styles/theme";

export const Action = styled(Flex)`
  justify-content: center;
  align-items: center;
  padding: 0 0 0 12px;
  height: 32px;
  font-size: 15px;
  flex-shrink: 0;

  &:empty {
    display: none;
  }
`;

export const Separator = styled.div`
  flex-shrink: 0;
  margin-left: 12px;
  width: 1px;
  height: 28px;
  background: ${s("divider")};
`;

const Actions = styled(Flex)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  border-radius: 3px;
  background: ${s("background")};
  transition: ${s("backgroundTransition")};
  padding: 12px;
  backdrop-filter: blur(20px);

  @media print {
    display: none;
  }

  ${breakpoint("tablet")`
    left: auto;
    padding: 24px;
  `};
`;