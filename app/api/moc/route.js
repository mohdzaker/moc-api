import { NextResponse } from "next/server";
import TonWeb from "tonweb";

// Initialize TonWeb with the correct provider URL
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));

// Define the API handler
export async function POST(req) {
    try {
        // Extract resultBoc from the request body
        const { resultBoc } = await req.json();

        if (!resultBoc) {
            return NextResponse.json({ error: "No BOC data provided" }, { status: 400 });
        }

        // Decode the BOC (Bag of Cells)
        const bocBytes = TonWeb.utils.base64ToBytes(resultBoc);
        const bocCells = await TonWeb.boc.Cell.fromBoc(bocBytes);

        if (bocCells && bocCells.length > 0) {
            const firstCell = bocCells[0];
            // Get the hash of the first cell
            const cellHash = firstCell.hash();
            const hashBase64 = TonWeb.utils.bytesToBase64(cellHash);

            // Return the decoded hash
            return NextResponse.json({ cellHashBase64: hashBase64 });
        } else {
            return NextResponse.json({ error: "No valid cells in the BOC" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error decoding BOC:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
