import { useCallback, useEffect, useRef } from "react";

/**
 * Hook to check if component is still mounted
 *
 * @returns {boolean} true if the component is mounted, false otherwise
 */
export function useIsMounted() {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
        isMounted.current = false;
        };
    }, []);

    return useCallback(() => isMounted.current, []);
}
