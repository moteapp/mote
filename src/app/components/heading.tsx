import { createElement, CSSProperties, PropsWithChildren } from 'react';

export type HeadingProps = PropsWithChildren & {
    as?: string;
    centered?: boolean;
    style?: CSSProperties;
};

export function Heading({ as, centered, children, style }: HeadingProps) {
    const tag = as || 'h1';
    const properties: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
    };
    if (centered) {
        properties.textAlign = 'center';
    }
    if (!as) {
        properties.marginTop = '6vh';
        properties.fontWeight = 600;
    }

    Object.assign(properties, style);

    return createElement(tag, { style }, children);
}
