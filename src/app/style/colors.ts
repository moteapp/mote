import { darken } from 'polished';
import { hash } from 'mote/base/common/hash';

export interface Colors {
    transparent: string;
    almostBlack: string;
    lightBlack: string;
    almostWhite: string;
    veryDarkBlue: string;
    slate: string;
    slateLight: string;
    slateDark: string;
    smoke: string;
    smokeLight: string;
    smokeDark: string;
    white: string;
    white05: string;
    white10: string;
    white50: string;
    white75: string;
    black: string;
    black05: string;
    black10: string;
    black50: string;
    black75: string;
    accent: string;
    yellow: string;
    warmGrey: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
    brand: {
        red: string;
        pink: string;
        purple: string;
        blue: string;
        marine: string;
        green: string;
        yellow: string;
    };
}

export const defaultColors: Colors = {
    transparent: 'transparent',
    almostBlack: '#111319',
    lightBlack: '#2F3336',
    almostWhite: '#E6E6E6',
    veryDarkBlue: '#08090C',
    slate: '#9BA6B2',
    slateLight: '#DAE1E9',
    slateDark: '#394351',
    smoke: '#F4F7FA',
    smokeLight: '#F9FBFC',
    smokeDark: '#E8EBED',
    white: '#FFFFFF',
    white05: 'rgba(255, 255, 255, 0.05)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white50: 'rgba(255, 255, 255, 0.5)',
    white75: 'rgba(255, 255, 255, 0.75)',
    black: '#000',
    black05: 'rgba(0, 0, 0, 0.05)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black50: 'rgba(0, 0, 0, 0.50)',
    black75: 'rgba(0, 0, 0, 0.75)',
    accent: '#0366d6',
    yellow: '#EDBA07',
    warmGrey: '#EDF2F7',
    danger: '#ed2651',
    warning: '#f08a24',
    success: '#2f3336',
    info: '#a0d3e8',
    brand: {
        red: '#FF5C80',
        pink: '#FF4DFA',
        purple: '#9E5CF7',
        blue: '#3633FF',
        marine: '#2BC2FF',
        green: '#3ad984',
        yellow: '#F5BE31',
    },
};

export const palette = [
    defaultColors.brand.red,
    defaultColors.brand.blue,
    defaultColors.brand.purple,
    defaultColors.brand.pink,
    defaultColors.brand.marine,
    defaultColors.brand.green,
    defaultColors.brand.yellow,
    darken(0.2, defaultColors.brand.red),
    darken(0.2, defaultColors.brand.blue),
    darken(0.2, defaultColors.brand.purple),
    darken(0.2, defaultColors.brand.pink),
    darken(0.2, defaultColors.brand.marine),
    darken(0.2, defaultColors.brand.green),
    darken(0.2, defaultColors.brand.yellow),
];

export const stringToColor = (input: string) => {
    const inputAsNumber = parseInt(hash(input).toString(), 16);
    return palette[inputAsNumber % palette.length];
};
