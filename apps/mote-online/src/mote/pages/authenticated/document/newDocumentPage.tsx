import useQuery from "mote/app/hooks/userQuery"
import { CenteredContent } from "mote/base/components/centeredContent"
import { DocumentPlaceholder } from "mote/base/components/document/documentPlaceholder"
import Flex from "mote/base/components/flex"
import { useEffect } from "react"

export const NewDocumentPage = () => {

    const query = useQuery();

    const createDocument = () => {

    }

    useEffect(() => {

    });

    return (
        <Flex column auto>
            <CenteredContent>
                <DocumentPlaceholder />
            </CenteredContent>
        </Flex>
    )
}