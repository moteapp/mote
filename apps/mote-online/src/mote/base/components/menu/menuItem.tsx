import { ForwardedRef, ReactNode, forwardRef } from "react";
import { MenuItem as BaseMenuItem } from "@ariakit/react";
import styled from "styled-components";

export interface IMenuItemProps {
    children?: ReactNode;
}

export const MenuItem = forwardRef(function _MenuItem({
    children
}: IMenuItemProps, ref: ForwardedRef<HTMLAnchorElement>) {
    return (
        <BaseMenuItem>
            {children}
        </BaseMenuItem>
    )
});

type MenuAnchorProps = {
    level?: number;
    disabled?: boolean;
    dangerous?: boolean;
    disclosure?: boolean;
    $active?: boolean;
};

const Spacer = styled.svg`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;