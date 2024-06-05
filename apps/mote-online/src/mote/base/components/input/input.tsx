import { s } from "mote/app/styles/theme";
import { InputHTMLAttributes, ReactNode, forwardRef, useRef, useState } from "react";
import styled from "styled-components";
import Flex from "mote/base/components/flex";
import { mergeRefs } from "react-merge-refs";

export const NativeTextarea = styled.textarea<{
    hasIcon?: boolean;
    hasPrefix?: boolean;
  }>`
    border: 0;
    flex: 1;
    padding: 8px 12px 8px
      ${(props) => (props.hasPrefix ? 0 : props.hasIcon ? "8px" : "12px")};
    outline: none;
    background: none;
    color: ${s("text")};
  
    &:disabled,
    &::placeholder {
      color: ${s("placeholder")};
      opacity: 1;
    }
  `;
  
  export const NativeInput = styled.input<{
    hasIcon?: boolean;
    hasPrefix?: boolean;
  }>`
    border: 0;
    flex: 1;
    padding: 8px 12px 8px
      ${(props) => (props.hasPrefix ? 0 : props.hasIcon ? "8px" : "12px")};
    outline: none;
    background: none;
    color: ${s("text")};
    height: 22px;
    min-width: 0;
    font-size: 15px;
  
    &:disabled,
    &::placeholder {
      color: ${s("placeholder")};
      opacity: 1;
    }
  
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0px 1000px ${s("background")} inset;
    }
  
    &::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
`;

export interface IInputProps extends Omit<
InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
"prefix"
> {
    short?: boolean;
    flex?: boolean;
    label?: string;
    margin?: string | number;
    type?: "text" | "email" | "checkbox" | "search" | "textarea";
    /** Optional icon that appears inside the input before the textarea */
    icon?: ReactNode;

    onFocus?: (ev: React.SyntheticEvent) => unknown;
    onBlur?: (ev: React.SyntheticEvent) => unknown;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
    function _Input(props, ref) {

        const { 
            className, short, flex, type = 'text',
            label, margin, icon,
            ...rest
        } = props;

        const [focused, setFocused] = useState(false);
        const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

        const handleBlur = (ev: React.SyntheticEvent) => {
            setFocused(false);
        
            if (props.onBlur) {
                props.onBlur(ev);
            }
        };

        const handleFocus = (ev: React.SyntheticEvent) => {
            setFocused(true);
        
            if (props.onFocus) {
                props.onFocus(ev);
            }
        };

        return (
            <Wrapper className={className} short={short} flex={flex}>
                <label>
                    <Outline focused={focused} margin={margin}>
                        {icon && <IconWrapper>{icon}</IconWrapper>}
                        {type === "textarea" ? (
                            <NativeTextarea 
                                ref={mergeRefs([ref, internalRef])}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                {...rest}
                            />
                        ) : (
                            <NativeInput 
                                ref={mergeRefs([ref, internalRef])}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                {...rest}
                            />
                        )}
                    </Outline>
                </label>
            </Wrapper>
        )
    }
);

export const Wrapper = styled.div<{
    flex?: boolean;
    short?: boolean;
    minHeight?: number;
    minWidth?: number;
    maxHeight?: number;
}>`
    flex: ${(props) => (props.flex ? "1" : "0")};
    width: ${(props) => (props.short ? "49%" : "auto")};
    max-width: ${(props) => (props.short ? "350px" : "100%")};
    min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : "initial")};
    min-height: ${({ minHeight }) => (minHeight ? `${minHeight}px` : "0")};
    max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : "initial")};
`;

export const TextWrapper = styled.span`
  min-height: 16px;
  display: block;
  margin-top: -16px;
`;

const IconWrapper = styled.span`
  position: relative;
  left: 4px;
  width: 24px;
  height: 24px;
`;

export const Outline = styled(Flex)<{
  margin?: string | number;
  hasError?: boolean;
  focused?: boolean;
}>`
  flex: 1;
  margin: ${(props) =>
    props.margin !== undefined ? props.margin : "0 0 16px"};
  color: inherit;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.hasError
      ? props.theme.danger
      : props.focused
      ? props.theme.inputBorderFocused
      : props.theme.inputBorder};
  border-radius: 4px;
  font-weight: normal;
  align-items: center;
  overflow: hidden;
  background: ${s("background")};

  /* Prevents an issue where input placeholder appears in a selected style when double clicking title bar */
  user-select: none;
`;

export const InputLarge = styled(Input)`
  height: 38px;
  flex-grow: 1;
  margin-right: 8px;

  input {
    height: 22px;
  }
`;