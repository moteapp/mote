import { useAppSelector } from 'mote/app/hooks';
import useQuery from 'mote/app/hooks/userQuery';
import { selectUser } from 'mote/app/slices/user/userSlice';
import { BackButton, ButtonLarge } from 'mote/base/components/buttton/button';
import Fade from 'mote/base/components/fade/fade';
import Flex from 'mote/base/components/flex';
import { Text } from 'mote/base/components/text';
import Heading from 'mote/base/components/heading';
import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthenticationProvider } from './authProvider';
import { s } from 'mote/app/styles/theme';

export const LoginPage = () => {

    const location = useLocation();
    const query = useQuery();
    const notice = query.get("notice");

    const user = useAppSelector(selectUser);

    const { t } = useTranslation();

    const [emailLinkSentTo, setEmailLinkSentTo] = useState<string>('');

    const isRegister = location.pathname === "/register";

    const handleReset = useCallback(() => {
        setEmailLinkSentTo('');
    }, []);

    const handleEmailSuccess = useCallback((email: string) => {
        setEmailLinkSentTo(email);
    }, []);

    if (emailLinkSentTo) {
        return (
            <Background>
                <BackButton />

                <Centered $align="center" justify="center" $column $auto>
                    <Heading centered>{t("Check your email")}</Heading>
                    <Note>
                        <Trans
                            defaults="A magic sign-in link has been sent to the email <em>{{ emailLinkSentTo }}</em> if an account exists."
                            values={{ emailLinkSentTo }}
                            components={{ em: <em /> }}
                        />
                    </Note>
                    <br />
                    <ButtonLarge onClick={handleReset} fullwidth neutral>
                        {t("Back to login")}
                    </ButtonLarge>
                </Centered>
            </Background>
        )
    }

    return (
        <Background>
            <BackButton />

            <Centered $align="center" justify="center" $gap={12} $column $auto>
                <Logo>
                    <img height={48} src="/images/mote-512.png" alt="logo" />
                </Logo>

                {
                    isRegister ? (
                        <>
                        </>
                    ): (
                        <>
                            <StyledHeading as="h2" centered>
                                {t("Login to Mote")}
                            </StyledHeading>
                        </>
                    )
                }
                <>
                    <AuthenticationProvider id='email' name='emai' 
                        isCreate={false}
                        authUrl={'/auth/email'}
                        onEmailSuccess={handleEmailSuccess}
                    />
                </>
            </Centered>
        </Background>
    )
}

const StyledHeading = styled(Heading)`
  margin: 0;
`;

const Logo = styled.div`
  margin-bottom: -4px;
`;

const Background = styled(Fade)`
  width: 100vw;
  height: 100%;
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
  color: ${s("textTertiary")};
  text-align: center;
  font-size: 14px;
  margin-top: 8px;

  em {
    font-style: normal;
    font-weight: 500;
  }
`;