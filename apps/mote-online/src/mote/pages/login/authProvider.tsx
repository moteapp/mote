import { clientAPI } from 'mote/app/client';
import { ButtonLarge } from 'mote/base/components/buttton/button';
import { SVGIcon } from 'mote/base/components/icon/svgIcon';
import { InputLarge } from 'mote/base/components/input/input';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export interface IAuthProviderProps {
    id: string;
    name: string;
    authUrl: string;
    isCreate: boolean;
    onEmailSuccess: (email: string) => void;
}

export const AuthenticationProvider = (props: IAuthProviderProps) => {
    const { t } = useTranslation();

    const [showEmailSignin, setShowEmailSignin] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState('');

    const { isCreate, id, name, authUrl } = props;

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (showEmailSignin && email) {
            setSubmitting(true);
            try {
                const response = await clientAPI.post(e.currentTarget.action, { email });

                if (response.redirect) {
                    window.location.href = response.redirect;
                } else {
                    props.onEmailSuccess(email);
                }
            } finally {
                setSubmitting(false);
            }
        } else {
            setShowEmailSignin(true);
        }
    
    }

    if (id === "email") {
        if (isCreate) {
          return null;
        }

        return (
            <Wrapper>
              <Form method="POST" action="/auth/email" onSubmit={handleSubmitEmail}>
              {showEmailSignin ? (
            <>
                <InputLarge
                    type="email"
                    name="email"
                    placeholder="me@domain.com"
                    value={email}
                    onChange={handleChangeEmail}
                    disabled={isSubmitting}
                    autoFocus
                    required
                    short
                />
                <ButtonLarge type="submit" disabled={isSubmitting}>
                    {t("Sign In")} →
                </ButtonLarge>
                </>
            ) : (
                <ButtonLarge type="submit" icon={<SVGIcon name='page' height='30px' width='30px'/>} fullwidth>
                    {t("Continue with Email")}
                </ButtonLarge>
            )}
              </Form>
            </Wrapper>
        );
    }

    return null;
}


const Wrapper = styled.div`
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;