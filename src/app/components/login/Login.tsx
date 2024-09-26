'use client';
import styled from 'styled-components';
import { Fade } from 'mote/app/components/Fade';
import { s } from 'mote/app/style/css';
import { BackButton } from './BackButton';
import { useAppSelector } from 'mote/app/store/hooks';
import { selectAuthConfig } from 'mote/app/store/features/auth/authSlice';

export function Login() {

    const config = useAppSelector(selectAuthConfig);

    if (!config) {
        return null;
    }

    const hasMultipleProviders = config.providers.length > 1;
    const defaultProvider = config.providers[0];

    return (
        <Background>
            <BackButton />
        </Background>
    );
}

const Background = styled(Fade)`
    width: 100vw;
    height: 100vh;
    background: ${s('background')};
    display: flex;
`;