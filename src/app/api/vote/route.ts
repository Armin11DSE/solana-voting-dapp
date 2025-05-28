import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Voting } from "@/../anchor/target/types/voting";
import IDL from "@/../anchor/target/idl/voting.json";
import { BN, Program } from "@coral-xyz/anchor";

export const OPTIONS = GET;

export async function GET(_request: Request) {
    const actionMetadata: ActionGetResponse = {
        icon: "https://101blockchains.com/wp-content/uploads/2023/02/solidity-vs-rust.png",
        title: "Vote for your favorite Programming Language!",
        description: "Vote between Rust and Solidity.",
        label: "Vote",
        links: {
            actions: [
                {
                    label: "Vote for Rust",
                    href: "/api/vote?candidate=Rust",
                    type: "transaction"
                },
                {
                    label: "Vote for Solidity",
                    href: "/api/vote?candidate=Solidity",
                    type: "transaction"
                }
            ]
        }
    };
    return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");
    if (candidate !== "Rust" && candidate !== "Solidity") {
        return new Response("Invalid candidate", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const program: Program<Voting> = new Program(IDL, { connection });
    const body: ActionPostRequest = await request.json();
    let voter;

    try {
        voter = new PublicKey(body.account);
    } catch (error) {
        return new Response(`Invalid account ${error}`, { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const instruction = await program.methods.vote(candidate, new BN(1)).accounts( {
        signer: voter,
    }).instruction();

    const blockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
        feePayer: voter,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add(instruction);

    const response = await createPostResponse({
        fields: {
            type: "transaction",
            transaction: transaction
        }
    });

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}
