import { defaultLightTheme, s } from "mote/app/styles/theme";
import { EmojiButton } from "mote/base/components/emoji/emoji";
import { ContentEditable } from "./contentEditable";
import styled, { css } from "styled-components";
import Flex from "mote/base/components/flex";
import { breakpoint } from "mote/app/styles/breakpoint";
import { forwardRef } from "react";
import { useBoolean } from "mote/app/hooks/useBoolean";

export interface IDocumentTitleProps {
    /** Title to display */
    title: string;

    /** Emoji to display */
    emoji?: string;

    /** Position of the emoji relative to text */
    emojiPosition: "side" | "top";

    /** Placeholder to display when the document has no title */
    placeholder?: string;

    /** Should the title be editable, policies will also be considered separately */
    readOnly?: boolean;
}


export const DocumentTitle = forwardRef(function _DocumentTitle(
    {
        title,
        emoji,
        placeholder,
    }: IDocumentTitleProps,
    ref: any
){
    const [emojiPickerIsOpen, handleOpen, handleClose] = useBoolean();
    
    return (
        <Title
            dir="auto"
            value={title}
            placeholder={placeholder}
            $containsEmoji={!!emoji}
            $emojiPickerIsOpen={emojiPickerIsOpen}
        >
            <EmojiWrapper $position="top">
            </EmojiWrapper>
        </Title>
    )
});

const EmojiWrapper = styled(Flex)<{ $position: "top" | "side"; dir?: string }>`
  height: 32px;
  width: 32px;

  // Always move above TOC
  z-index: 1;

  ${(props) =>
    props.$position === "top"
      ? css`
          position: relative;
          top: -8px;
        `
      : css`
          position: absolute;
          top: 8px;
          ${(props: any) =>
            props.dir === "rtl" ? "right: -40px" : "left: -40px"};
        `}
`;

type TitleProps = {
    $containsEmoji: boolean;
    $emojiPickerIsOpen: boolean;
};

const lineHeight = "1.25";
const fontSize = "2.25em";
  
const Title = styled(ContentEditable)<TitleProps>`
    position: relative;
    line-height: ${lineHeight};
    margin-top: 6vh;
    margin-bottom: 0.5em;
    margin-left: ${(props) =>
      props.$containsEmoji || props.$emojiPickerIsOpen ? "40px" : "0px"};
    font-size: ${fontSize};
    font-weight: 600;
    border: 0;
    padding: 0;
    cursor: ${(props) => (props.readOnly ? "default" : "text")};
  
    > span {
      outline: none;
    }
  
    &::placeholder {
      color: ${s("placeholder")};
      -webkit-text-fill-color: ${s("placeholder")};
      opacity: 1;
    }
  
    &:focus-within,
    &:focus {
      margin-left: 40px;
  
      ${EmojiButton} {
        opacity: 1 !important;
      }
    }
  
    ${EmojiButton} {
      opacity: ${(props: TitleProps) =>
        props.$containsEmoji ? "1 !important" : 0};
    }
  
    ${breakpoint("tablet")`
      margin-left: 0;
  
      &:focus-within,
      &:focus {
        margin-left: 0;
      }
  
      &:hover {
        ${EmojiButton} {
          opacity: 0.5;
  
          &:hover {
            opacity: 1;
          }
        }
      }`};
  
    @media print {
      color: ${defaultLightTheme.text};
      -webkit-text-fill-color: ${defaultLightTheme.text};
      background: none;
    }
`;