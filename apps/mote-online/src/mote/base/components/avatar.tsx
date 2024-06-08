import styled from "styled-components";
import Flex from "./flex";

export enum AvatarSize {
    Small = 16,
    Toast = 18,
    Medium = 24,
    Large = 32,
    XLarge = 48,
    XXLarge = 64,
}

export interface IAvatar {
    avatarUrl?: string;
    color?: string;
    initial?: string;
    id?: string;
}

export interface IAvatarProps {
    size: AvatarSize;
    src?: string;
    model?: IAvatar;
    alt?: string;
    showBorder?: boolean;
    style?: React.CSSProperties;
}

export const Avatar = ({
    style,
    model,
    src,
    showBorder,
    size = AvatarSize.Medium,
    ...rest
}: IAvatarProps) => {
    return (
        <Relative style={style}>
            {src ? (<CircleImg
                size={size}
                src={src}
                $showBorder={showBorder}
                {...rest}
                />) : model ? (
                    <Initials color={model.color} $showBorder={showBorder} size={size} {...rest}>
                        {model.initial}
                    </Initials>
                ) : (
                    <Initials $showBorder={showBorder} size={size} {...rest} />
                )
            }
        </Relative>
    )
}

const Relative = styled.div`
  position: relative;
  user-select: none;
  flex-shrink: 0;
`;

const CircleImg = styled.img<{ size: number; $showBorder?: boolean }>`
  display: block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  border: ${(props) =>
    props.$showBorder === false
      ? "none"
      : `2px solid ${props.theme.background}`};
  flex-shrink: 0;
  overflow: hidden;
`;

const Initials = styled(Flex)<{
    color?: string;
    size: number;
    $showBorder?: boolean;
  }>`
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: ${(props) => props.color};
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    border-radius: 50%;
    border: 2px solid
      ${(props) =>
        props.$showBorder === false ? "transparent" : props.theme.background};
    flex-shrink: 0;
    font-size: ${(props) => props.size / 2}px;
    font-weight: 500;
`;