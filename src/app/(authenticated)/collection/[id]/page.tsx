'user server';
import { Trans } from "react-i18next/TransWithoutContext";
import { NewDoc } from "mote/app/components/button/new-doc-button";
import { DocumentList } from "mote/app/components/document/document-list";
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

    if (!documents || documents.length === 0) {
        return (
            <div className="mx-auto w-full max-w-4xl">
                <p className="mb-4">
                    <Trans 
                        i18n={i18n.i18n}
                        defaults="<em>{{ collectionName }}</em> doesn’t contain any documents yet."
                        values={{ collectionName: collection?.name }}
                        components={{ em: <strong /> }}
                    />
                    <br />
                    <Trans i18n={i18n.i18n}>Get started by creating a new one!</Trans>
                </p>
                <NewDoc collectionId={collectionId}/>
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-4xl">
            <DocumentList documents={documents}/>
        </div>
    )
}