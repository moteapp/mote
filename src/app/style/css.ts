import { keyframes } from 'styled-components';

/**
 * Mixin to make text ellipse when it overflows.
 *
 * @returns string of CSS
 */
export const ellipsis = () => `
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/**
 * Mixin to return a theme value.
 *
 * @returns a theme value
 */
export const s = (key: string) => (props: { theme?: Record<string, string> }) => {
    return String(props.theme![key]);
};
