import styled, { css } from 'styled-components';
import { ellipsis } from '../style/css';

type TextProps = {
    /** The type of text to render */
    type?: 'secondary' | 'tertiary' | 'danger';
    /** The size of the text */
    size?: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';
    /** The direction of the text (defaults to ltr) */
    dir?: 'ltr' | 'rtl' | 'auto';
    /** Whether the text should be selectable (defaults to false) */
    selectable?: boolean;
    /** The font weight of the text */
    weight?: 'xbold' | 'bold' | 'normal';
    /** Whether the text should be truncated with an ellipsis */
    ellipsis?: boolean;
};

/**
 * Use this component for all interface text that should not be selectable
 * by the user, this is the majority of UI text explainers, notes, headings.
 */
export const Text = styled.span<TextProps>`
    margin-top: 0;
    text-align: ${(props) => (props.dir ? props.dir : 'inherit')};
    color: ${(props) =>
        props.type === 'secondary'
            ? props.theme.textSecondary
            : props.type === 'tertiary'
              ? props.theme.textTertiary
              : props.type === 'danger'
                ? props.theme.brand.red
                : props.theme.text};
    font-size: ${(props) =>
        props.size === 'xlarge'
            ? '26px'
            : props.size === 'large'
              ? '18px'
              : props.size === 'medium'
                ? '16px'
                : props.size === 'small'
                  ? '14px'
                  : props.size === 'xsmall'
                    ? '13px'
                    : 'inherit'};

    ${(props) =>
        props.weight &&
        css`
            font-weight: ${props.weight === 'xbold'
                ? 600
                : props.weight === 'bold'
                  ? 500
                  : props.weight === 'normal'
                    ? 400
                    : 'inherit'};
        `}

    white-space: normal;
    user-select: ${(props) => (props.selectable ? 'text' : 'none')};

    ${(props) => props.ellipsis && ellipsis()}
`;
