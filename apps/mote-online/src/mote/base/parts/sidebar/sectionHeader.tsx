import { s } from "mote/app/styles/theme";
import { SVGIcon } from "mote/base/components/icon/svgIcon";
import { useCallback, useState } from "react";
import styled, { keyframes } from "styled-components";

export interface ISectionHeaderProps {
    /** Unique header id – if passed the header will become toggleable */
    id?: string;
    title: React.ReactNode;
    children?: React.ReactNode;
}

export const SectionHeader = ({
    id,
    title,
    children
}: ISectionHeaderProps) => {

    const [firstRender, setFirstRender] = useState(true);
    const [expanded, setExpanded] = useState(true);

    const handleClick = useCallback(() => {
        setExpanded(!expanded);
    }, [expanded, setExpanded]);

    return (
        <>
            <H3>
                <Button onClick={handleClick} disabled={!id}>
                {title}
                {id && <Disclosure name='leftArrow' expanded={expanded} size={20} />}
                </Button>
            </H3>
            {expanded && (firstRender ? children : <Fade>{children}</Fade>)}
        </>
    )
}

export const fadeAndSlideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const Fade = styled.span`
  animation: ${fadeAndSlideDown} 100ms ease-in-out;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  user-select: none;
  color: ${s("textTertiary")};
  letter-spacing: 0.03em;
  margin: 0;
  padding: 4px 2px 4px 12px;
  height: 22px;
  border: 0;
  background: none;
  border-radius: 4px;
  -webkit-appearance: none;
  transition: all 100ms ease;

  &:not(:disabled):hover,
  &:not(:disabled):active {
    color: ${s("textSecondary")};
    cursor: var(--pointer);
  }
`;

const Disclosure = styled(SVGIcon)<{ expanded?: boolean }>`
  transition: opacity 100ms ease, transform 100ms ease, fill 50ms !important;
  ${({ expanded }) => !expanded && "transform: rotate(-90deg);"};
  opacity: 0;
`;

const H3 = styled.h3`
  margin: 0;

  &:hover {
    ${Disclosure} {
      opacity: 1;
    }
  }
`;