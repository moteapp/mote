import { ReactNode, useCallback } from "react";

export interface IEventBoundaryProps {
    children?: ReactNode;
    className?: string;
}

export const EventBoundary = ({
    children, className
}: IEventBoundaryProps) => {
    const handleClick = useCallback((event: React.SyntheticEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    <span onClick={handleClick} className={className}>
        {children}
    </span>
}