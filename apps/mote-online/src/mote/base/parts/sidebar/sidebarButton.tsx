import Flex from "mote/base/components/flex";
import { ForwardedRef, forwardRef } from "react";
import styled from "styled-components";

export interface ISidebarButtonProps {
    position: "top" | "bottom";
}

export const SidebarButton = forwardRef(function _SidebarButton(
    {
        position = "top"
    } : ISidebarButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
) {
    return (
        <Container 
            $position={position}
        >
            SidebarButton
        </Container>
    )
});

const Container = styled(Flex)<{ $position: "top" | "bottom" }>`
  padding-top: 0 px;
`;