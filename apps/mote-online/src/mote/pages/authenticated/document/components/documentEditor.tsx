import Flex from "mote/base/components/flex";
import { forwardRef } from "react";
import { DocumentTitle } from "./documentTitle";
import { useTranslation } from "react-i18next";
import { EditorWrapper } from "./editorWrapper";

export interface IDocumentEditorProps {

}


export const DocumentEditor = forwardRef(function _DocumentEditor(
    {
    }: IDocumentEditorProps,
    ref: any
){
    const { t } = useTranslation();

    return (
        <Flex $auto $column>
            <DocumentTitle
                title=""
                placeholder={t("Untitled")}
                emojiPosition="side"
            />
            <EditorWrapper 
                placeholder={t("Type '/' to insert, or start writing…")}
            />
        </Flex>
    )
})