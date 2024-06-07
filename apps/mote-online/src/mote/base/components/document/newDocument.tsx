import { useTranslation } from "react-i18next";
import { Tooltip } from "../tooltip";
import { Button } from "../buttton/button";
import { SVGIcon } from "../icon/svgIcon";
import { Link } from "react-router-dom";

export function newDocumentPath(
    collectionId?: string | null,
    params: {
      parentDocumentId?: string;
      templateId?: string;
    } = {}
): string {
    const searchParams = new URLSearchParams(params);
    return collectionId
      ? `/collection/${collectionId}/new?${searchParams.toString()}`
      : `/doc/new`;
}

export const NewDocumentButton = () => {
    const { t } = useTranslation();

    return (
        <Tooltip
            content={t("New document")}
            shortcut="n"
            delay={500}
            placement="bottom"
        >
            <Button as={Link} to={newDocumentPath()} icon={<SVGIcon name="plus" height="18px" width="18px" fill="#ffffff"/>}>
                {t("New doc")}
            </Button>
        </Tooltip>
    )
}