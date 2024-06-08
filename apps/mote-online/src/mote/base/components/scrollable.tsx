import { hideScrollbars } from "mote/app/styles/styles";
import { ForwardedRef, ReactNode, forwardRef } from "react";
import styled from "styled-components";

export interface IScrollableProps {
    children?: ReactNode;
    flex?: boolean;
    shadow?: boolean;
}

export const Scrollable = forwardRef(function _Scrollable({
    children, flex
}: IScrollableProps, ref: ForwardedRef<HTMLDivElement>) {
    return (
        <Wrapper
            ref={ref}
            $flex={flex}
        >
            {children}
        </Wrapper>
    )
});

const Wrapper = styled.div<{
    $flex?: boolean;
    $topShadowVisible?: boolean;
    $bottomShadowVisible?: boolean;
    $hiddenScrollbars?: boolean;
  }>`
    display: ${(props) => (props.$flex ? "flex" : "block")};
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
    box-shadow: ${(props) => {
      if (props.$topShadowVisible && props.$bottomShadowVisible) {
        return "0 1px inset rgba(0,0,0,.1), 0 -1px inset rgba(0,0,0,.1)";
      }
  
      if (props.$topShadowVisible) {
        return "0 1px inset rgba(0,0,0,.1)";
      }
  
      if (props.$bottomShadowVisible) {
        return "0 -1px inset rgba(0,0,0,.1)";
      }
  
      return "none";
    }};
    transition: box-shadow 100ms ease-in-out;
  
    ${(props) => props.$hiddenScrollbars && hideScrollbars()}
`;
  