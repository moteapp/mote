import Flex from "mote/base/components/flex";
import { ForwardedRef, ReactNode, forwardRef } from "react";
import styled from "styled-components";
import { s } from "mote/app/styles/theme";
import { extraArea } from "mote/app/styles/styles";
import { Text } from "mote/base/components/text";

export interface ISidebarButtonProps {
    title?: ReactNode;
    image?: ReactNode;
    position?: "top" | "bottom";
}

export const SidebarButton = forwardRef(function _SidebarButton(
    {
        title,
        image,
        position = "top"
    } : ISidebarButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
) {
    return (
        <Container 
            $position={position}
        >
            <Button 
                $position={position}
                as="button"
                role="button"
                ref={ref}
            >
                <Content gap={8} align="center">
                    {image}
                    {title && <Title>{title}</Title>}
                </Content>
            </Button>
        </Container>
    )
});

const Container = styled(Flex)<{ $position: "top" | "bottom" }>`
  padding-top: 0 px;
`;

const Title = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Content = styled(Flex)`
  flex-shrink: 1;
  flex-grow: 1;
`;

const Button = styled(Flex)<{
    $position: "top" | "bottom";
  }>`
    flex: 1;
    color: ${s("textTertiary")};
    align-items: center;
    padding: 4px;
    font-size: 15px;
    font-weight: 500;
    border-radius: 4px;
    border: 0;
    margin: ${(props) => (props.$position === "top" ? 16 : 8)}px 0;
    background: none;
    flex-shrink: 0;
  
    -webkit-appearance: none;
    text-decoration: none;
    text-align: left;
    user-select: none;
    cursor: var(--pointer);
    position: relative;
  
    ${extraArea(4)}
  
    &:active,
    &:hover,
    &[aria-expanded="true"] {
      color: ${s("sidebarText")};
      transition: background 100ms ease-in-out;
      background: ${s("sidebarActiveBackground")};
    }
  
    &:last-child {
      margin-right: 8px;
    }
  
    &:first-child {
      margin-left: 8px;
    }
`;