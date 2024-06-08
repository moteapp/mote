import { NudeButton } from "mote/base/components/buttton/budeButton";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import { s } from "mote/app/styles/theme";
import { SVGIcon } from "mote/base/components/icon/svgIcon";

export interface IDisclosureProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    expanded: boolean;
    root?: boolean;
}

const Disclosure = ({
    expanded,
    root,
    onClick,
    ...rest
}: IDisclosureProps) => {
    const { t } = useTranslation();

    return (
        <Button
            size={20}
            onClick={onClick}
            $root={root}
            aria-label={expanded ? t("Collapse") : t("Expand")}
            {...rest}
        >
            <StyledCollapsedIcon expanded={expanded} name="chevronLeft" size={20} />
        </Button>
    );
}

const Button = styled(NudeButton)<{ $root?: boolean }>`
  position: absolute;
  left: -24px;
  flex-shrink: 0;
  color: ${s("textSecondary")};

  &:hover {
    color: ${s("text")};
    background: ${s("sidebarControlHoverBackground")};
  }

  ${(props) =>
    props.$root &&
    css`
      opacity: 0;
      left: -16px;

      &:hover {
        opacity: 1;
        background: none;
      }
    `}
`;

const StyledCollapsedIcon = styled(SVGIcon)<{
  expanded?: boolean;
}>`
  transition: opacity 100ms ease, transform 100ms ease, fill 50ms !important;
  ${(props) => !props.expanded && "transform: rotate(-90deg);"};
`;

export const StyledDisclosure = styled(Disclosure)``;