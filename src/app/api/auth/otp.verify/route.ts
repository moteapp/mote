import { NextResponse } from "next/server";

export async function GET(request: Request) {
    return NextResponse.json({
        data: {
            token: 'token',
        },
        ok: true,
        status: 200,
    });
}
