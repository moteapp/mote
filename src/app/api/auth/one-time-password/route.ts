import { addMonths } from 'date-fns';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import { GenerateOneTimePasswordRequest, LoginWithOneTimePasswordResponse } from "mote/platform/request/common/request";
import { RedisAdapter } from "mote/platform/storage/common/redis";
import { accountProvisioner } from "mote/server/actions/accountProvisioner";
import { generateJwtToken } from 'mote/server/common/jwt';
import { MagicLinkEmail } from "mote/server/emails/template/magic-link-email";

const providerName = 'magiclink';

export async function POST(request: Request) {

    const payload: GenerateOneTimePasswordRequest = await request.json();

    const confirmationCode = Math.floor(100000 + Math.random() * 900000)
        .toString()
        .slice(0, 6);
    console.log(`confirmationCode to user<email=${payload.email}>`, confirmationCode);

    // Save the confirmation code in Redis
    await RedisAdapter.defaultClient.set(
        generateOTPKey(payload.email),
        confirmationCode,
        'EX',
        10 * 60
    );

    // send email to users email address with a short-lived token
    await new MagicLinkEmail({
        to: payload.email,
        token: confirmationCode,
    }).send();

    return NextResponse.json({
        ok: true,
        status: 200,
    });
}

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email')!;
    const code = searchParams.get('code');

    const confirmationCode = await RedisAdapter.defaultClient.get(generateOTPKey(email));

    if (confirmationCode !== code) {
        console.log(`Invalid code for user<email=${email}, otp=${confirmationCode}>`, code);
        return new Response('Invalid code', {
            status: 401,
        });
    }

    const { user, info } = await verifyUser({ email });
    const expires = addMonths(new Date(), 3);
    const token = generateJwtToken(user, expires);

    const cookieStore = await cookies();
    cookieStore.set('credential', token, { expires });

    const data: LoginWithOneTimePasswordResponse = {
        token,
        user,
        space: info.space,
        provider: {
            id: providerName,
            name: providerName,
            authUrl: ''
        }
    }
    
    return NextResponse.json({
        data,
        ok: true,
        status: 200,
    });
}

function generateOTPKey(user: string) {
    return `otp:${user}`;
}

async function verifyUser(user: GenerateOneTimePasswordRequest) {
    const name = user.email.split('@')[0];
    const result = await accountProvisioner({
        ip: '',
        space: {
            name,
            subdomain: '',
        },
        user: {
            name,
            email: user.email,
        },
        authenticationProvider: {
            name: providerName,
            providerId: user.email,
        },
    });
    return { user: result.user, info: result };
}
