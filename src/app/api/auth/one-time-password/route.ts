import { NextResponse } from "next/server";
import { GenerateOneTimePasswordRequest } from "mote/platform/request/common/request";

export async function POST(request: Request) {
    const payload: GenerateOneTimePasswordRequest = await request.json();

    return NextResponse.json({
        ok: true,
        status: 200,
    });
}

export async function GET(request: Request) {
    return NextResponse.json({
        data: {
            token: 'token',
        },
        ok: true,
        status: 200,
    });
}
