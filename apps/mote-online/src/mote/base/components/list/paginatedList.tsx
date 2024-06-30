import { useState } from "react";
import { Placeholder } from "../placeholder/placeholder";

export interface IPaginatedListProps<T> {
    className?: string;
    empty?: React.ReactNode;
    isFetching?: boolean;
    isFetchingMore?: boolean;
    items: T[];
    renderItem?: (item: T, index: number) => React.ReactNode;
}

export function PaginatedList<T>({
    className,
    isFetching,
    isFetchingMore,
    items,
    renderItem,
}: IPaginatedListProps<T>) {

    const showLoading =
      isFetching &&
      !isFetchingMore;
    
    if (showLoading) {
        return (
            <div className={className}>
                <Placeholder count={5} />
            </div>
        )
    }

    const children = renderItem && items.map((item, index) => renderItem(item, index));
    
    return (
        <>
            {children}
        </>
    )
}