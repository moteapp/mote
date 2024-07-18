import { ReactElement, ReactNode } from 'react';
import { DocumentModel } from '@mote/base/dist/model/documentModel';
import { PaginatedList } from '../list/PaginatedList';

export type PaginatedDocumentListProps = {
    documents: DocumentModel[];
    heading?: ReactNode;
};

export function PaginatedDocumentList({
    documents,
}: PaginatedDocumentListProps) {
    return (
        <PaginatedList<DocumentModel>
            data={documents}
            renderItem={(document) => (
                <div key={document.id}>{document.id}</div>
            )}
        />
    );
}
