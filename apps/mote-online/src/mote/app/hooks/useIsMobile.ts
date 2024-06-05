import {useMediaQuery, breakpoints} from './useMediaQuery';

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${breakpoints.tablet - 1}px)`);
}
