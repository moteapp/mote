import { useParams } from "react-router-dom";
import { Document } from "./components/document";

export interface IDocumentPageProps {}

export const DocumentPage = (props: IDocumentPageProps) => {
    const params = useParams();
    const document = {
        id: params.documentId!,
        title: "Document",
    } as any;
    return (
        <Document
            document={document}
        />
    );
};