import { useTranslation } from 'react-i18next';
import { SVGIcon } from 'mote/base/components/icon/svgIcon';
import styled, { useTheme } from 'styled-components';
import { darken, lighten, transparentize } from 'polished';
import * as platform from '@mote/base/common/platform';
import { ActionButton, IActionButtonProps } from './actionButton';
import { s } from 'mote/app/styles/theme';
import { ElementType, ForwardedRef, ReactNode, forwardRef } from 'react';

export const BackButton = () => {
    const theme = useTheme();
    console.log(theme);
    const { t } = useTranslation();
    return (
        <Link href={'/'}>
            <SVGIcon name='back' size={24} /> {t("Back to home")}
        </Link>
    )
}

const Link = styled.a`
  display: flex;
  align-items: center;
  color: inherit;
  padding: ${platform.isElectron ? "48px 32px" : "32px"};
  font-weight: 500;
  position: absolute;

  svg {
    transition: transform 100ms ease-in-out;
  }

  &:hover {
    svg {
      transform: translateX(-4px);
    }
  }
`;

type RealProps = {
  $fullwidth?: boolean;
  $borderOnHover?: boolean;
  $neutral?: boolean;
  $danger?: boolean;
};

const RealButton = styled(ActionButton)<RealProps>`
  display: ${(props) => (props.$fullwidth ? "block" : "inline-block")};
  width: ${(props) => (props.$fullwidth ? "100%" : "auto")};
  margin: 0;
  padding: 0;
  border: 0;
  background: ${s("accent")};
  color: ${s("accentText")};
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  height: 32px;
  text-decoration: none;
  flex-shrink: 0;
  cursor: var(--pointer);
  user-select: none;
  appearance: none !important;

  &::-moz-focus-inner {
    padding: 0;
    border: 0;
  }

  &:hover:not(:disabled),
  &[aria-expanded="true"] {
    background: ${(props) => darken(0.05, props.theme.accent)};
  }

  &:disabled {
    cursor: default;
    pointer-events: none;
    color: ${(props) => transparentize(0.5, props.theme.accentText)};
    background: ${(props) => lighten(0.2, props.theme.accent)};

    svg {
      fill: ${(props) => props.theme.white50};
    }
  }

  ${(props) =>
    props.$neutral &&
    `
    background: inherit;
    color: ${props.theme.buttonNeutralText};
    box-shadow: ${
      props.$borderOnHover
        ? "none"
        : `rgba(0, 0, 0, 0.07) 0px 1px 2px, ${props.theme.buttonNeutralBorder} 0 0 0 1px inset`
    };

    &:hover:not(:disabled),
    &[aria-expanded="true"] {
      background: ${
        props.$borderOnHover
          ? props.theme.buttonNeutralBackground
          : darken(0.05, props.theme.buttonNeutralBackground)
      };
      box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, ${
        props.theme.buttonNeutralBorder
      } 0 0 0 1px inset;
    }

    &:disabled {
      color: ${props.theme.textTertiary};
      background: none;

      svg {
        fill: currentColor;
      }
    }
  `}

  ${(props) =>
    props.$danger &&
    `
      background: ${props.theme.danger};
      color: ${props.theme.white};

      &:hover:not(:disabled),
      &[aria-expanded="true"] {
        background: ${darken(0.05, props.theme.danger)};
      }

      &:disabled {
        background: ${lighten(0.05, props.theme.danger)};
      }

      &.focus-visible {
        outline-color: ${darken(0.2, props.theme.danger)} !important;
      }
  `};
`;

export interface IButtonProps<T> extends IActionButtonProps {
    value?: any;
    icon?: ReactNode;
    disclosure?: boolean;
    type?: string;
    neutral?: boolean;
    fullwidth?: boolean;

    as?: T;
    to?: string;
}

export const Button = forwardRef(
    function _Button<T extends ElementType = 'button'>(
        props: IButtonProps<T>, ref: ForwardedRef<HTMLButtonElement>
    ) {
        const { children, value, icon, disclosure, fullwidth, type, ...rest } = props;

        const hasText = !!children || value !== undefined;
        const hasIcon = icon !== undefined;

        return (
            <RealButton {...rest} ref={ref} 
                $fullwidth={fullwidth}
            >
                <Inner hasIcon={hasIcon} hasText={hasText} disclosure={disclosure}>
                    {hasIcon && icon}
                    {hasText && <Label hasIcon={hasIcon}>{children || value}</Label>}
                </Inner>
            </RealButton>
        )
    }
);

const Label = styled.span<{ hasIcon?: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${(props) => props.hasIcon && "padding-left: 4px;"};
`;

export const Inner = styled.span<{
  disclosure?: boolean;
  hasIcon?: boolean;
  hasText?: boolean;
}>`
  display: flex;
  padding: 0 8px;
  padding-right: ${(props) => (props.disclosure ? 2 : 8)}px;
  line-height: ${(props) => (props.hasIcon ? 24 : 32)}px;
  justify-content: center;
  align-items: center;
  min-height: 32px;

  ${(props) => props.hasIcon && props.hasText && "padding-left: 4px;"};
  ${(props) => props.hasIcon && !props.hasText && "padding: 0 4px;"};
`;

export const ButtonLarge = styled(Button)`
  height: 40px;

  ${Inner} {
    padding: 4px 16px;
  }
`;