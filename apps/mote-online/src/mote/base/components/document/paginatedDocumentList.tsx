import React from "react"
import { PaginatedList } from "../list/paginatedList"


export interface IPaginatedDocumentListProps {
    empty?: React.ReactNode;
}

export const PaginatedDocumentList = ({
    empty
}:IPaginatedDocumentListProps) => {
    return (
        <PaginatedList >
            
        </PaginatedList>
    )
}