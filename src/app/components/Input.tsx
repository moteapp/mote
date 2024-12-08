import { VisuallyHidden } from '@ariakit/react/visually-hidden';
import { ForwardedRef, forwardRef, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import styled from 'styled-components';
import { ellipsis, s } from '../style/css';
import { Flex } from './Flex';

export const LabelText = styled.div`
    font-weight: 500;
    padding-bottom: 4px;
    display: inline-block;
`;

export const Wrapper = styled.div<{
    $flex?: boolean;
    $short?: boolean;
    $minHeight?: number;
    $minWidth?: number;
    $maxHeight?: number;
}>`
    flex: ${(props) => (props.$flex ? '1' : '0')};
    width: ${(props) => (props.$short ? '49%' : 'auto')};
    max-width: ${(props) => (props.$short ? '350px' : '100%')};
    min-width: ${({ $minWidth }) => ($minWidth ? `${$minWidth}px` : 'initial')};
    min-height: ${({ $minHeight }) => ($minHeight ? `${$minHeight}px` : '0')};
    max-height: ${({ $maxHeight }) => ($maxHeight ? `${$maxHeight}px` : 'initial')};
`;

const IconWrapper = styled.span`
    position: relative;
    left: 4px;
    width: 24px;
    height: 24px;
`;

export const NativeInput = styled.input<{
    hasIcon?: boolean;
    hasPrefix?: boolean;
}>`
    border: 0;
    flex: 1;
    padding: 8px 12px 8px
        ${(props) => (props.hasPrefix ? 0 : props.hasIcon ? '8px' : '12px')};
    outline: none;
    background: none;
    color: ${s('text')};
    height: 30px;
    min-width: 0;
    font-size: 15px;

    ${ellipsis()}

    &:disabled,
    &::placeholder {
        color: ${s('placeholder')};
        opacity: 1;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px ${s('background')} inset;
    }

    &::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    ${({ theme }) => theme.breakpoints.between('sm', 'md')} {
        font-size: 16px;
    }
`;

export const NativeTextarea = styled.textarea<{
    hasIcon?: boolean;
    hasPrefix?: boolean;
}>`
    border: 0;
    flex: 1;
    padding: 8px 12px 8px
        ${(props) => (props.hasPrefix ? 0 : props.hasIcon ? '8px' : '12px')};
    outline: none;
    background: none;
    color: ${s('text')};

    &:disabled,
    &::placeholder {
        color: ${s('placeholder')};
        opacity: 1;
    }
`;

export type InputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    'prefix'
> & {
    type?: 'text' | 'email' | 'checkbox' | 'search' | 'textarea';
    label?: string;
    labelHidden?: boolean;
    margin?: string | number;
    flex?: boolean;
    /** Optional component that appears inside the input before the textarea and any icon */
    prefix?: React.ReactNode;
    /** Optional icon that appears inside the input before the textarea */
    icon?: React.ReactNode;
    /** Like autoFocus, but also select any text in the input */
    autoSelect?: boolean;
    short?: boolean;

    /** Callback is triggered with the CMD+Enter keyboard combo */
    onRequestSubmit?: (
        ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => unknown;
    onFocus?: (ev: React.SyntheticEvent) => unknown;
    onBlur?: (ev: React.SyntheticEvent) => unknown;
};

export const Input = forwardRef(function Input(
    {
        type,
        label,
        labelHidden,
        margin,
        prefix,
        icon,
        short,
        flex,
        className,
        onBlur,
        onFocus,
        onKeyDown,
        onRequestSubmit,
        ...rest
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
) {
    const [focused, setFocused] = useState(false);
    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

    const wrappedLabel = <LabelText>{label}</LabelText>;

    const handleBlur = (ev: React.SyntheticEvent) => {
        setFocused(false);

        if (onBlur) {
            onBlur(ev);
        }
    };

    const handleFocus = (ev: React.SyntheticEvent) => {
        setFocused(true);

        if (onFocus) {
            onFocus(ev);
        }
    };

    const handleKeyDown = (
        ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (ev.key === 'Enter' && ev.metaKey) {
            if (onRequestSubmit) {
                onRequestSubmit(ev);
            }
        }

        if (onKeyDown) {
            onKeyDown(ev);
        }
    };

    return (
        <Wrapper className={className} $short={short} $flex={flex}>
            <label>
                {label &&
                    (labelHidden ? (
                        <VisuallyHidden>{wrappedLabel}</VisuallyHidden>
                    ) : (
                        wrappedLabel
                    ))}
                <Outline focused={focused} margin={margin}>
                    {prefix}
                    {icon && <IconWrapper>{icon}</IconWrapper>}
                    {type === 'textarea' ? (
                        <NativeTextarea
                            ref={mergeRefs([
                                internalRef,
                                ref as React.RefObject<HTMLTextAreaElement>,
                            ])}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                            hasIcon={!!icon}
                            hasPrefix={!!prefix}
                            {...rest}
                        />
                    ) : (
                        <NativeInput
                            ref={mergeRefs([
                                internalRef,
                                ref as React.RefObject<HTMLInputElement>,
                            ])}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onKeyDown={handleKeyDown}
                            hasIcon={!!icon}
                            hasPrefix={!!prefix}
                            type={type}
                            {...rest}
                        />
                    )}
                </Outline>
            </label>
        </Wrapper>
    );
});

export const Outline = styled(Flex)<{
    margin?: string | number;
    hasError?: boolean;
    focused?: boolean;
}>`
    flex: 1;
    margin: ${(props) => (props.margin !== undefined ? props.margin : '0 0 16px')};
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
    background: ${s('background')};

    /* Prevents an issue where input placeholder appears in a selected style when double clicking title bar */
    user-select: none;
`;

export const InputLarge = styled(Input)`
    height: 38px;
    flex-grow: 1;
    margin-right: 8px;

    input {
        height: 38px;
    }
`;
