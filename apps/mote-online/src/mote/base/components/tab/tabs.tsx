import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { AnimateSharedLayout } from "framer-motion";
import { transparentize } from "polished";
import { s } from "mote/app/styles/theme";
import styled from "styled-components";
import { useWindowSize } from "mote/app/hooks/useWindowSize";

export interface ITabsProps {
    children: ReactNode;
}

export const Tabs = ({children}: ITabsProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const [shadowVisible, setShadow] = useState(false);
    const { width } = useWindowSize();

    const updateShadows = useCallback(() => {
        const nav = navRef.current;
        if (!nav) {
            return;
        }
        const scrollLeft = nav.scrollLeft;
        const wrapperWidth = nav.scrollWidth - nav.clientWidth;
        const fade = !!(wrapperWidth - scrollLeft !== 0);
    
        if (fade !== shadowVisible) {
            setShadow(fade);
        }
    }, [shadowVisible]);

    useEffect(() => {
        updateShadows();
    }, [width, updateShadows]);

    return (
       
        <Sticky>
            <Nav ref={navRef} onScroll={updateShadows} $shadowVisible={shadowVisible}>
                {children}
            </Nav>
        </Sticky>
      
    )
}

const Nav = styled.nav<{ $shadowVisible?: boolean }>`
  border-bottom: 1px solid ${s("divider")};
  margin: 12px 0;
  overflow-y: auto;
  white-space: nowrap;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;
    pointer-events: none;
    background: ${(props) =>
      props.$shadowVisible
        ? `linear-gradient(
      90deg,
      ${transparentize(1, props.theme.background)} 0%,
      ${props.theme.background} 100%
    )`
        : `transparent`};
  }
`;

// When sticky we need extra background coverage around the sides otherwise
// items that scroll past can "stick out" the sides of the heading
const Sticky = styled.div`
  position: sticky;
  top: 54px;
  margin: 0 -8px;
  padding: 0 8px;
  background: ${s("background")};
  transition: ${s("backgroundTransition")};
  z-index: 1;
`;

export const Separator = styled.span`
  border-left: 1px solid ${s("divider")};
  position: relative;
  top: 2px;
  margin-right: 24px;
  margin-top: 6px;
`;