import styled from "styled-components";
import { ActionButton, IActionButtonProps } from "./actionButton";

type Props = IActionButtonProps & {
    width?: number | string;
    height?: number | string;
    size?: number;
    type?: "button" | "submit" | "reset";
};

export const NudeButton = styled(ActionButton).attrs((props) => ({
    type: "type" in props ? props.type : "button",
  }) as any)<Props>`
    width: ${(props) =>
      typeof props.width === "string"
        ? props.width
        : `${props.width || props.size || 24}px`};
    height: ${(props) =>
      typeof props.height === "string"
        ? props.height
        : `${props.height || props.size || 24}px`};
    background: none;
    border-radius: 4px;
    display: inline-block;
    line-height: 0;
    border: 0;
    padding: 0;
    cursor: var(--pointer);
    user-select: none;
    color: inherit;
`;