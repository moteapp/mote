import { useState, useEffect } from "react";

export const breakpoints = {
  mobile: 0,
  mobileLarge: 460,
  // targeting all devices
  tablet: 737,
  // targeting devices that are larger than the iPhone 6 Plus (which is 736px in landscape mode)
  desktop: 1025,
  // targeting devices that are larger than the iPad (which is 1024px in landscape mode)
  desktopLarge: 1600,
};

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (window.matchMedia) {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => {
        setMatches(media.matches);
      };
      media.addListener(listener);
      return () => media.removeListener(listener);
    }

    return undefined;
  }, [matches, query]);

  return matches;
}
