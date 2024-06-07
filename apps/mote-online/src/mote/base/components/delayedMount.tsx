import { ReactNode, useEffect, useState } from "react"

interface IDelayedMountProps {
    delay?: number;
    children: ReactNode
}

export const DelayedMount = ({ delay = 250, children }: IDelayedMountProps) => {
    const [isShowing, setShowing] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShowing(true), delay);
        return () => {
          clearTimeout(timeout);
        };
    }, [delay]);

    if (!isShowing) {
        return null;
    }
    
    return children;
}