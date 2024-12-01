import { useState } from "react";
import styled from "styled-components";
import { useClientTranslation } from "mote/app/i18n/i18nForClient";
import { loginWithOneTimePassword } from "mote/app/store/features/auth/authSlice";
import { useAppDispatch } from "mote/app/store/hooks";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";

export type OTPAuthenticationProps = {
    emailLinkSentTo: string;
};

export function OneTimePasswordAuth({ emailLinkSentTo }: OTPAuthenticationProps) {
    const dispatch = useAppDispatch();
    const { t } = useClientTranslation();
    const [code, setCode] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    const handleChangeCode = (value: string) => {
        setCode(value);
    };

    const handleSubmitCode = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (code && code.length === 6) {
            dispatch(loginWithOneTimePassword({ email: emailLinkSentTo, code }));
        }
    };

    return (
        <Form method="GET" action={'/auth/otp.callback'} onSubmit={handleSubmitCode}>
            <InputOTP maxLength={6} value={code} onChange={handleChangeCode} containerClassName="mr-6">
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <Button type="submit" disabled={isSubmitting}>
                {t('Sign In')} →
            </Button>
        </Form>
    );
}

const Form = styled.form`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;
