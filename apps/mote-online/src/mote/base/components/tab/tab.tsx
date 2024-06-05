import styled, { useTheme } from "styled-components";
import { NavLink } from "../navLink";
import { s } from "mote/app/styles/theme";
import { hover } from "mote/app/styles/styles";
import { ReactNode } from "react";
import { Location, useMatch } from "react-router-dom";
import { m } from "framer-motion";

const transition = {
    type: "spring",
    stiffness: 500,
    damping: 30,
  };

export interface ITabProps {
    to: string;
    /**
     * If true, the tab will only be active if the path matches exactly.
     */
    exact?: boolean;
    children: ReactNode;
}

export const Tab = (props: ITabProps) => {
    const match = useMatch(props.to);
    const theme = useTheme();
    const activeStyle = {
        color: theme.textSecondary,
    };

    return (
        <TabLink to={props.to} activeStyle={activeStyle}>
            {props.children}
            {match && (
                <Active
                    initial={false}
                    animate={{ scale: 1 }}
                    transition={transition}
                />
            )}
        </TabLink>
    );
}

const TabLink = styled(NavLink)`
  position: relative;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  cursor: var(--pointer);
  color: ${s("textTertiary")};
  user-select: none;
  margin-right: 24px;
  padding: 6px 0;

  &: ${hover} {
    color: ${s("textSecondary")};
  }
`;

const Active = styled(m.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  width: 100%;
  border-radius: 3px;
  background: ${s("textSecondary")};
`;

