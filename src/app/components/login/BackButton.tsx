import { useClientTranslation } from 'mote/app/i18n/i18nForClient';
import styled from 'styled-components';

export function BackButton() {
    const { t } = useClientTranslation();
    return <Link href="/">{'<' + t('Back to home')}</Link>;
}

const Link = styled.a`
    display: flex;
    align-items: center;
    color: inherit;
    padding: 32px;
    font-weight: 500;
    position: absolute;

    svg {
        transition: transform 100ms ease-in-out;
    }

    &:hover {
        svg {
            transform: translateX(-4px);
        }
    }
`;
