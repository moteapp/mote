'user server';
import { NavDocumentList } from "mote/app/components/document/document-list";
import { getCollection, getDocuments } from "mote/app/lib/dal";
import { useI18n } from "mote/platform/i18n/common/i18n";

export default async function CollectionHomePage({ 
    params 
} : { params: Promise<{ id: string }> }) {
    const collectionId = (await params).id;
    const collectionData = getCollection(collectionId);
    const documentsData = getDocuments(collectionId);
    const i18nData = useI18n();

    const [collection, documents, i18n] = await Promise.all([collectionData, documentsData, i18nData]);

    return (
        <div className="mx-auto w-full max-w-4xl">
            <NavDocumentList i18n={i18n} collection={collection} documents={documents}/>
        </div>
    )
}