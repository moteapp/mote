import { useState } from "react";
import { Placeholder } from "../placeholder/placeholder";

export interface IPaginatedListProps<T> {
    className?: string;
    empty?: React.ReactNode;
}

export function PaginatedList<T>({
    className
}: IPaginatedListProps<T>) {

    const [isFetching, setIsFetching] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const showLoading =
      isFetching &&
      !isFetchingMore;
    
    return (
        <div className={className}>
            <Placeholder count={5} />
        </div>
    )
}