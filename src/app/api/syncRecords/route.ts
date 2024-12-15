import { syncRecord } from "mote/app/lib/dal";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const pointer = await request.json();
    const data = await syncRecord(pointer);
    return NextResponse.json({
        ok: true,
        data,
        status: 200,
    });
}