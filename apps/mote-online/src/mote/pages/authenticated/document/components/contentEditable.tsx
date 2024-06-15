import { s } from "mote/app/styles/theme";
import { forwardRef, useRef, useState } from "react";
import styled from "styled-components";

export interface IContentEditableProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "ref" | "onChange"> {
    children?: React.ReactNode;
    className?: string;
    readOnly?: boolean;
    value: string;
    placeholder?: string;
    disabled?: boolean;

    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onChange?: (text: string) => void;
    onInput?: React.FormEventHandler<HTMLSpanElement> | undefined;
}

type ContentCallBack = 
    | React.FocusEventHandler<HTMLSpanElement>
    | React.FormEventHandler<HTMLSpanElement>
    | React.KeyboardEventHandler<HTMLSpanElement>
    | undefined

export const ContentEditable = forwardRef(function _ContentEditable({
    className,
    children,
    readOnly,
    value,
    onChange,
    onInput,
    placeholder,
    disabled,
} : IContentEditableProps, ref: any){

    const contentRef = useRef<HTMLSpanElement>(null);
    const lastValue = useRef(value);
    const [innerValue, setInnerValue] = useState("");


    const wrappedEvent = (callback: ContentCallBack) => (e: any) => {
        if (readOnly) {
            return;
        }

        const text = e.currentTarget.textContent || "";

        if (text !== lastValue.current) {
            lastValue.current = text;
            onChange?.(text);
        }

        callback?.(e);
    }

    return (
        <div className={className}>
            {children}
            <Content
                ref={contentRef}
                role="textbox"
                contentEditable={!disabled && !readOnly}
                onInput={wrappedEvent(onInput)}
                data-placeholder={placeholder}
            >
                {innerValue}
            </Content>
        </div>
    )
});

const Content = styled.span`
  background: ${s("background")};
  transition: ${s("backgroundTransition")};
  color: ${s("text")};
  -webkit-text-fill-color: ${s("text")};
  outline: none;
  resize: none;
  cursor: text;
  word-break: anywhere;

  &:empty {
    display: inline-block;
  }

  &:empty::before {
    display: inline-block;
    color: ${s("placeholder")};
    -webkit-text-fill-color: ${s("placeholder")};
    content: attr(data-placeholder);
    pointer-events: none;
    height: 0;
  }
`;