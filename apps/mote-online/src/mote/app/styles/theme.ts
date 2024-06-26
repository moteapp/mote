import { darken, transparentize } from 'polished';
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
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Inter, 'Segoe UI', Roboto, Oxygen, sans-serif",
    fontFamilyMono:
      "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    accentText: colors.white,
    commentMarkBackground: transparentize(0.5, "#2BC2FF"),
    noticeInfoBackground: colors.brand.blue,
    noticeInfoText: colors.almostBlack,
    noticeTipBackground: "#F5BE31",
    noticeTipText: colors.almostBlack,
    noticeWarningBackground: "#d73a49",
    noticeWarningText: colors.almostBlack,
    noticeSuccessBackground: colors.brand.green,
    noticeSuccessText: colors.almostBlack,
    ...colors
}

const spacing = {
    sidebarWidth: 260,
    sidebarRightWidth: 300,
    sidebarCollapsedWidth: 16,
    sidebarMinWidth: 200,
    sidebarMaxWidth: 600,
};

export const defaultLightTheme = {
    ...defaultColors,
    background: colors.white,
    secondaryBackground: colors.warmGrey,
    link: colors.accent,
    cursor: colors.almostBlack,
    placeholder: "#a2b2c3",
    text: colors.almostBlack,
    textSecondary: colors.slateDark,
    textTertiary: colors.slate,
    inputBorder: colors.slateLight,
    inputBorderFocused: colors.slate,
    divider: colors.slateLight,
    tooltipBackground: colors.almostBlack,
    tooltipText: colors.white,
    sidebarBackground: colors.warmGrey,
    sidebarActiveBackground: "#d7e0ea",
    sidebarControlHoverBackground: "rgb(138 164 193 / 20%)",
    sidebarDraftBorder: darken("0.25", colors.warmGrey),
    sidebarText: "rgb(78, 92, 110)",
    ...spacing,
}

export const defaultDarkTheme = {
    ...defaultColors,
    ...spacing,
}