import styled from "styled-components";
import { SidebarButton } from "./sidebarButton";
import { hover } from "mote/app/styles/styles";

export const ToggleButton = styled(SidebarButton)`
  opacity: 0;
  transition: opacity 100ms ease-in-out;

  &:${hover},
  &:active {
    opacity: 1;
  }
`;