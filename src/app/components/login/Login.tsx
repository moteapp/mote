'use client';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { Fade } from 'mote/app/components/Fade';
import { Text } from 'mote/app/components/Text';
import { useClientTranslation } from 'mote/app/lib/i18nForClient';
import { resetEmailLinkSendTo, selectAuthConfig, selectCredential, selectEmailLinkSentTo } from 'mote/app/store/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from 'mote/app/store/hooks';
import { s } from 'mote/app/style/css';
import { Flex } from '../Flex';
import { Heading } from '../heading';
import { Button } from '../ui/button';
import { BackButton } from './BackButton';
import { AuthenticationProvider } from './authentication-provider';
import { OneTimePasswordAuth } from './one-time-password-auth';

export function Login() {
    const { t } = useClientTranslation();
    const router = useRouter();
    const config = useAppSelector(selectAuthConfig);
    const emailLinkSentTo = useAppSelector(selectEmailLinkSentTo);
    const credential = useAppSelector(selectCredential);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (credential && credential.token) {
            const cookies = new Cookies(null, { path: '/' });
            cookies.set('credential', credential.token, { path: '/' });
            router.push('/home');
        }
    }, [credential, router]);

    if (!config) {
        return null;
    }

    const handleReset = () => {
        dispatch(resetEmailLinkSendTo());
    };

    if (emailLinkSentTo) {
        return (
            <Background>
                <BackButton />
                <Centered $column $auto $justify="center" $align="center">
                    <Heading centered>{t('Check your email')}</Heading>
                    <Note>
                        <Trans
                            defaults="A magic sign-in link has been sent to the email <em>{{ emailLinkSentTo }}</em> if an account exists."
                            values={{ emailLinkSentTo }}
                            components={{ em: <em key={emailLinkSentTo}/> }}
                        />
                    </Note>
                    <br />
                    <OneTimePasswordAuth emailLinkSentTo={emailLinkSentTo} />
                    <br />
                    <Button onClick={handleReset} style={{width: '100%'}}>
                        {t('Back to login')}
                    </Button>
                </Centered>
            </Background>
        )
    }

    const hasMultipleProviders = config.providers.length > 1;
    const defaultProvider = config.providers[0];

    return (
        <Background>
            <BackButton />
            <Centered $column $auto $justify="center" $align="center">
                <Heading as="h2" centered style={{margin: 0}}>
                    {t('Login to {{ authProviderName }}', {
                        authProviderName: config.name || process.env.NEXT_PUBLIC_APP_NAME,
                    })}
                </Heading>
                {defaultProvider && (
                    <Fragment key={defaultProvider.id}>
                        <AuthenticationProvider
                            id={defaultProvider.id}
                            name={defaultProvider.name}
                            authUrl={defaultProvider.authUrl}
                        />
                    </Fragment>
                )}
            </Centered>
        </Background>
    );
}

const Background = styled(Fade)`
    width: 100vw;
    height: 100vh;
    background: ${s('background')};
    display: flex;
`;

const Centered = styled(Flex)`
    user-select: none;
    width: 90vw;
    height: 100%;
    max-width: 320px;
    margin: 0 auto;
`;

const Note = styled(Text)`
    color: ${s('textTertiary')};
    text-align: center;
    font-size: 14px;
    margin-top: 8px;

    em {
        font-style: normal;
        font-weight: 500;
    }
`;
