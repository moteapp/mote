import { NextResponse } from "next/server";
import { prisma } from "mote/base/parts/storage/common/prisma";
import { OperationExecutor } from "mote/platform/record/common/operationExecutor";
import { IRecordService } from "mote/platform/record/common/record";
import { ApplyTransationsRequest } from "mote/platform/request/common/request";
import { StandaloneServices } from "mote/server/serverServices";


export async function POST(request: Request) {
    const payload: ApplyTransationsRequest = await request.json();
    console.log('applyTransactions', JSON.stringify(payload));
    const recordService = StandaloneServices.get(IRecordService);
   
    for (const transaction of payload.transactions) {
        for (const operation of transaction.operations) {
            const record = await OperationExecutor.runOperation(operation, recordService);
            await prisma.block.upsert({
                where: { id: operation.id },
                create: record as any,
                update: record,
            });
        }
    }
    
    return NextResponse.json({
        data: {
        },
        ok: true,
        status: 200,
    });
}