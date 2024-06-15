import useQuery from "mote/app/hooks/userQuery"
import { CenteredContent } from "mote/base/components/centeredContent"
import { DocumentPlaceholder } from "mote/base/components/document/documentPlaceholder"
import Flex from "mote/base/components/flex"
import { useEffect } from "react"
import { redirect, useNavigate } from "react-router-dom"

export const NewDocumentPage = () => {

    const query = useQuery();
    const navigate = useNavigate();
    const collectionId = query.get("collectionId");

    const createDocument = () => {
        const parentDocumentId = query.get("parentDocumentId") ?? undefined;
        setTimeout(() => {
            navigate("/doc/123")
        }, 1000);
    }

    useEffect(() => {
        createDocument();
    });

    return ( 
        <Flex column auto>
            <CenteredContent>
                <DocumentPlaceholder />
            </CenteredContent>
        </Flex>
    )
}