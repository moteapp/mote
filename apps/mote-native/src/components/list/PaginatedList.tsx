import { ReactElement, ReactNode } from 'react';
import { FlatList, FlatListProps } from 'react-native';

export type PaginatedItem = {
    id: string;
    createdAt?: string;
    updatedAt?: string;
};

export type PaginatedListProps<T extends PaginatedItem> = {
    data: T[];
    style?: FlatListProps<T>['style'];
    heading?: ReactNode;
    renderItem: (item: T, index: number) => ReactElement;
};

export function PaginatedList<T extends PaginatedItem>({
    data,
    style,
    heading,
    renderItem,
}: PaginatedListProps<T>) {
    return (
        <FlatList<T>
            data={data}
            style={style}
            renderItem={(info) => renderItem(info.item, info.index)}
        />
    );
}
