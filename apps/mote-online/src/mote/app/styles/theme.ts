import { DefaultTheme} from 'styled-components';

/**
 * Mixin to return a theme value.
 *
 * @returns a theme value
 */
export const s =
  (key: keyof DefaultTheme) => (props: { theme: DefaultTheme }) =>
    String(props.theme[key]);

export const colors = {
    transparent: "transparent",
    almostBlack: "#111319",
    lightBlack: "#2F3336",
    almostWhite: "#E6E6E6",
    veryDarkBlue: "#08090C",
    slate: "#9BA6B2",
    slateLight: "#DAE1E9",
    slateDark: "#394351",
    smoke: "#F4F7FA",
    smokeLight: "#F9FBFC",
    smokeDark: "#E8EBED",
    white: "#FFFFFF",
    white05: "rgba(255, 255, 255, 0.05)",
    white10: "rgba(255, 255, 255, 0.1)",
    white50: "rgba(255, 255, 255, 0.5)",
    white75: "rgba(255, 255, 255, 0.75)",
    black: "#000",
    black05: "rgba(0, 0, 0, 0.05)",
    black10: "rgba(0, 0, 0, 0.1)",
    black50: "rgba(0, 0, 0, 0.50)",
    black75: "rgba(0, 0, 0, 0.75)",
    accent: "#0366d6",
    yellow: "#EDBA07",
    warmGrey: "#EDF2F7",
    danger: "#f4345d",
    warning: "#f08a24",
    success: "#2f3336",
    info: "#a0d3e8",
    brand: {
      red: "#FF5C80",
      pink: "#FF4DFA",
      purple: "#9E5CF7",
      blue: "#3633FF",
      marine: "#2BC2FF",
      green: "#3ad984",
      yellow: "#F5BE31",
    },
};

export const defaultColors = {
    accentText: colors.white,
    ...colors
}

export const defaultLightTheme = {
    ...defaultColors,
    background: colors.white,
    secondaryBackground: colors.warmGrey,
    link: colors.accent,
    cursor: colors.almostBlack,
    text: colors.almostBlack,
    textSecondary: colors.slateDark,
    textTertiary: colors.slate,
    inputBorder: colors.slateLight,
    inputBorderFocused: colors.slate,
    divider: colors.slateLight,
}