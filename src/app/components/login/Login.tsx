'use client';
import styled from 'styled-components';
import { Fade } from 'mote/app/components/Fade';
import { s } from 'mote/app/style/css';
import { BackButton } from './BackButton';

export function Login() {
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