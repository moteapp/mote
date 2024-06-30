import styled from "styled-components";
import Flex from "../flex";
import { pulsate } from "mote/app/styles/animations";
import { s } from "mote/app/styles/theme";
import { useRef } from "react";
import Fade from "mote/base/components/fade/fade";

export interface IPlaceholderProps {
    count?: number;
    className?: string;
    header?: ITextPlaceholderProps;
    body?: ITextPlaceholderProps;
}

export const Placeholder = ({
    count,
    className,
    header,
    body
}: IPlaceholderProps) => {
    return (
        <Fade>
            {Array.from({ length: count || 2 }).map((_, index) => (
                <Item key={index} className={className} $column $auto>
                    <TextPlaceholder {...header} header delay={0.2 * index} />
                    <TextPlaceholder {...body} delay={0.2 * index} />
                </Item>
            ))}
        </Fade>
    )
}

const Item = styled(Flex)`
  padding: 10px 0;
`;

export interface ITextPlaceholderProps {
    header?: boolean;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    delay?: number;
}

export const TextPlaceholder = ({
    minWidth,
    maxWidth,
    ...restProps
}: ITextPlaceholderProps) => {
    // We only want to compute the width once so we are storing it inside ref
    const widthRef = useRef(randomInteger(minWidth || 75, maxWidth || 100));

    return <Mask width={widthRef.current} {...restProps} />;
}

const Mask = styled(Flex)<{
    width: number;
    height?: number;
    delay?: number;
    header?: boolean;
  }>`
    width: ${(props) => (props.header ? props.width / 2 : props.width)}%;
    height: ${(props) =>
      props.height ? props.height : props.header ? 24 : 18}px;
    margin-bottom: 6px;
    border-radius: 6px;
    background-color: ${s("divider")};
    animation: ${pulsate} 2s infinite;
    animation-delay: ${(props) => props.delay || 0}s;
  
    &:last-child {
      margin-bottom: 0;
    }
`;
function randomInteger(min: number, max: number): any {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

