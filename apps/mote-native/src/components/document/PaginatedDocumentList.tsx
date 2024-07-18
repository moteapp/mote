import { ReactElement, ReactNode } from 'react';
import { DocumentModel } from '@mote/base/dist/model/documentModel';
import { PaginatedList } from '../list/PaginatedList';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { DocumentCard } from './DocumentCard';

export type PaginatedDocumentListProps = {
    documents: DocumentModel[];
    heading?: ReactNode;
};

export function PaginatedDocumentList({
    documents,
}: PaginatedDocumentListProps) {
    return (
        <ThemedView
            style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
            }}
        >
            {documents.map((document) => (
                <DocumentCard key={document.id} document={document} />
            ))}
        </ThemedView>
    );
}
