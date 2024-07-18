import { ReactElement, ReactNode } from 'react';
import { FlatList } from 'react-native';

export type PaginatedItem = {
    id: string;
    createdAt?: string;
    updatedAt?: string;
};

export type PaginatedListProps<T extends PaginatedItem> = {
    data: T[];
    heading?: ReactNode;
    renderItem: (item: T, index: number) => ReactElement;
};

export function PaginatedList<T extends PaginatedItem>({
    data,
    heading,
    renderItem,
}: PaginatedListProps<T>) {
    return (
        <FlatList<T>
            data={data}
            renderItem={(info) => renderItem(info.item, info.index)}
        />
    );
}
