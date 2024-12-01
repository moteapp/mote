import { useState } from "react";
import styled from "styled-components";
import { useClientTranslation } from "mote/app/i18n/i18nForClient";
import { generateOneTimePassword, selectIsLogging } from "mote/app/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "mote/app/store/hooks";
import { InputLarge } from "../Input";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export type AuthenticationProviderProps = {
    id: string;
    name: string;
    authUrl: string;
};

export function AuthenticationProvider({
    id,
    name,
    authUrl,
}: AuthenticationProviderProps) {
    if (id === 'email') {
        return <EmailAuthProvider />;
    }
    return <div></div>;
}

function EmailAuthProvider() {

    const dispatch = useAppDispatch();
    const isLogging = useAppSelector(selectIsLogging);
    const { t } = useClientTranslation();
    const [showEmailSignin, setShowEmailSignin] = useState(false);
    const [email, setEmail] = useState('');

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSubmitEmail = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (showEmailSignin && email) {
            dispatch(generateOneTimePassword(email));
        } else {
            setShowEmailSignin(true);
        }
    };

    return (
        <Wrapper>
            <Form method="POST" action={'/auth/otp'} onSubmit={handleSubmitEmail}>
                {showEmailSignin ? (
                    <>
                        <Input
                            type="email"
                            name="email"
                            placeholder="me@domain.com"
                            value={email}
                            onChange={handleChangeEmail}
                            disabled={isLogging}
                            autoFocus
                            required
                            style={{marginRight: 8}}
                        />
                        <Button type="submit">{t('Sign In')} →</Button>
                    </>
                ) : (
                    <Button type="submit" style={{display: 'block', width: '100%'}}>
                        {t('Continue with Email')}
                    </Button>
                )}
            </Form>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
`;

const Form = styled.form`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;