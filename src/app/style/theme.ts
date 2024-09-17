import { createStyledBreakpointsTheme } from 'styled-breakpoints';
import { Colors, defaultColors } from './colors';
import { darken, lighten } from 'polished';

const buildBaseTheme = (input: Partial<Colors>) => {
    const colors = {
        ...defaultColors,
        ...input,
    };
    return {
        fontFamily:
            "-apple-system, BlinkMacSystemFont, Inter, 'Segoe UI', Roboto, Oxygen, sans-serif",
        fontFamilyMono:
            "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
        fontFamilyEmoji:
            'Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Segoe UI, Twemoji Mozilla, Noto Color Emoji, Android Emoji',
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
        backgroundTransition: 'background 100ms ease-in-out',
        accentText: colors.white,
        ...colors,
        ...createStyledBreakpointsTheme(),
    };
};

export const buildLightTheme = (input: Partial<Colors>) => {
    const baseTheme = buildBaseTheme(input);

    return {
        ...baseTheme,
        isDark: false,
        background: baseTheme.white,
        text: baseTheme.almostBlack,
        cursor: baseTheme.almostBlack,
        textSecondary: lighten(0.1, baseTheme.slate),
        textTertiary: baseTheme.slate,
        divider: baseTheme.slateLight,
        sidebarBackground: baseTheme.warmGrey,

        tooltipBackground: baseTheme.almostBlack,
        tooltipText: baseTheme.white,
        toastBackground: baseTheme.white,
        toastText: baseTheme.almostBlack,

        buttonNeutralBackground: baseTheme.white,
        buttonNeutralText: baseTheme.almostBlack,
        buttonNeutralBorder: darken(0.15, baseTheme.white),
    };
};

export const buildDrakTheme = (input: Partial<Colors>) => {
    const baseTheme = buildBaseTheme(input);

    return {
        ...baseTheme,
        isDark: true,
        background: baseTheme.almostBlack,
        text: baseTheme.almostWhite,
        cursor: baseTheme.almostWhite,
        textSecondary: lighten(0.1, baseTheme.slate),
        textTertiary: baseTheme.slate,
        divider: lighten(0.1, baseTheme.almostBlack),
        sidebarBackground: baseTheme.veryDarkBlue,

        tooltipBackground: baseTheme.white,
        tooltipText: baseTheme.lightBlack,
        toastBackground: baseTheme.veryDarkBlue,
        toastText: baseTheme.almostWhite,

        buttonNeutralBackground: baseTheme.almostBlack,
        buttonNeutralText: baseTheme.white,
        buttonNeutralBorder: baseTheme.slateDark,
    };
};

export const lightTheme = buildLightTheme(defaultColors);
export const drakTheme = buildDrakTheme(defaultColors);

export type Theme = typeof lightTheme;
