import { EventType, addDisposableThrottledListener } from "@mote/base/browser/dom";
import { DisposableStore } from "@mote/base/common/lifecycle";
import { useEffect, useState } from "react";

/**
 * A debounced hook that listens to the window resize event and returns the
 * size of the current window.
 *
 * @returns An object containing width and height of the current window
 */
export function useWindowSize(){
    const [windowSize, setWindowSize] = useState({
        width: window.visualViewport?.width || window.innerWidth,
        height: window.visualViewport?.height || window.innerHeight,
    });

    const handleResize = () => {
        const width = window.visualViewport?.width || window.innerWidth;
        const height = window.visualViewport?.height || window.innerHeight;

        setWindowSize((state) => {
            if (width === state.width && height === state.height) {
              return state;
            }
      
            return { width, height };
        });
    }

    useEffect(() => {
        const store = new DisposableStore();

        store.add(addDisposableThrottledListener(window, EventType.RESIZE, handleResize, undefined, 100));
        store.add(addDisposableThrottledListener(window.visualViewport, EventType.RESIZE, handleResize, undefined, 100));

        return () => store.dispose();
    });

    return windowSize;
}