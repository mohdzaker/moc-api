import { NextResponse } from "next/server";
import { Cell, bytesToBase64 } from "ton";

function base64ToBytes(base64) {
    const binaryString = Buffer.from(base64, "base64").toString("binary");
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export async function POST(req) {
    try {
        const { resultBoc } = await req.json();
        console.log("Received BOC: ", resultBoc);

        const bocBytes = base64ToBytes(resultBoc);

        const cell = Cell.fromBoc(bocBytes)[0];

        const bocHashBytes = cell.hash();

        const hashBase64 = bytesToBase64(bocHashBytes);

        let transaction_boc = resultBoc;
        let transaction_boc_base64_hash = hashBase64;

        return NextResponse.json({
            transaction_boc,
            transaction_boc_base64_hash,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to process request" });
    }
}

export async function GET(req) {
    return NextResponse.json({ status: "failed", message: "This endpoint is only for POST requests" });
}
