import { css } from "styled-components";

export const defaultBreakpoints = {
    mobile: 0,
    mobileLarge: 460,
    // targeting all devices
    tablet: 737,
    // targeting devices that are larger than the iPhone 6 Plus (which is 736px in landscape mode)
    desktop: 1025,
    // targeting devices that are larger than the iPad (which is 1024px in landscape mode)
    desktopLarge: 1600,
};

export type BreakpointMap = { [name: string]: number };
export type StyledComponentsInterpolation =
  | ((executionContext: Object) => StyledComponentsInterpolation)
  | string
  | number
  | StyledComponentsInterpolation[]
  | false
  | undefined
  ;

type ComponentProps = {
    theme: {
      breakpoints?: BreakpointMap
    }
};

export function breakpoint(gte: string, lt?: string) {
    return function (strings: TemplateStringsArray, ...interpolations: StyledComponentsInterpolation[]) {
      return function ({ theme = {} }: ComponentProps) {
        return _breakpoint(theme.breakpoints || defaultBreakpoints, gte, lt)(strings, ...interpolations);
      };
    };
}

function _breakpoint(breakpoints: BreakpointMap, gte: string, lt?: string) {
    if (typeof lt === 'undefined') {
      return _gte(breakpoints, gte);
    } else {
      return _between(breakpoints, gte, lt);
    }
};

function _gt(breakpoints: BreakpointMap, name: string) {
    return withSingleCriteria(breakpoints, name, 'min-width', +1);
}
  
function _gte(breakpoints: BreakpointMap, name: string) {
    return withSingleCriteria(breakpoints, name, 'min-width');
}

function _lt(breakpoints: BreakpointMap, name: string) {
    return withSingleCriteria(breakpoints, name, 'max-width', -1);
}

function _lte(breakpoints: BreakpointMap, name: string) {
    return withSingleCriteria(breakpoints, name, 'max-width');
}

function _between(breakpoints: BreakpointMap, gte: string, lt: string) {
    const gteValue = getValueFromName(breakpoints, gte);
    const ltValue = getValueFromName(breakpoints, lt);
    return function (strings: TemplateStringsArray, ...interpolations: StyledComponentsInterpolation[]) {
      return css`@media (min-width: ${convertPxToEm(gteValue)}em) and (max-width: ${convertPxToEm(ltValue - 1)}em) {
        ${css(strings, ...interpolations)}
      }`;
    };
}

function convertPxToEm(pixels: number): number {
    // @media is always calculated off 16px regardless of whether the root font size is the default or not
    return pixels / 16;
  }
  
function getValueFromName(breakpoints: BreakpointMap, name: string): number {
    const value = breakpoints[name];
    if (process.env.NODE_ENV !== 'production' && typeof value === 'undefined') {
      console.error(`A breakpoint named "${name}" does not exist.`); // eslint-disable-line no-console
      return 0;
    }
    return value;
}

function withSingleCriteria(breakpoints: BreakpointMap, name: string, operator: 'min-width' | 'max-width', offset: number = 0) {
    const value = getValueFromName(breakpoints, name);
  
    // special case for 0 to avoid wrapping styles in an unnecessary @media block
    // FIXME: typings
    // if (operator === 'max-width' && value === 0) {
    //   return () => '';
    // }
  
    // special case for 0 to avoid wrapping styles in an unnecessary @media block
    if (operator === 'min-width' && value === 0) {
      return function (strings: TemplateStringsArray, ...interpolations: StyledComponentsInterpolation[]) {
        return css(strings, ...interpolations);
      }
    }
  
  
    return function (strings: TemplateStringsArray, ...interpolations: StyledComponentsInterpolation[]) {
      return css`@media (${operator}: ${convertPxToEm(value + offset)}em) {
        ${css(strings, ...interpolations)}
      }`;
    };
}