import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { startAnchor } from "solana-bankrun"
import { BankrunProvider } from "anchor-bankrun"
import { describe, it, expect, beforeAll } from "@jest/globals"

import IDL from '../target/idl/voting.json'

const votingAddress = new PublicKey("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

describe('Voting', () => {
  let context, provider, votingProgram: Program<Voting>;

  beforeAll(async () => {
    context = await startAnchor('', [{ name: "voting", programId: votingAddress }], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider,
    );
  })

  it('Initialize Poll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "what is your favorite programming language",
      new anchor.BN(0),
      new anchor.BN(1748333296),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("what is your favorite programming language");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it('Initialize Candidate', async () => {
    await votingProgram.methods.initializeCandidate(
      "Solidity",
      new anchor.BN(1),
    ).rpc();

    await votingProgram.methods.initializeCandidate(
      "Rust",
      new anchor.BN(1),
    ).rpc();

    const [rustAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Rust")],
      votingAddress,
    );
    const rustCandidate = await votingProgram.account.candidate.fetch(rustAddress);

    const [solidityAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Solidity")],
      votingAddress,
    );
    const solidityCandidate = await votingProgram.account.candidate.fetch(solidityAddress);

    console.log(rustCandidate);
    console.log(solidityCandidate);

    expect(rustCandidate.candidateVotes.toNumber()).toEqual(0);
    expect(solidityCandidate.candidateVotes.toNumber()).toEqual(0);
  })

  it("vote", async () => {
    await votingProgram.methods.vote(
      "Rust",
      new anchor.BN(1),
    ).rpc();

    const [rustAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Rust")],
      votingAddress,
    );
    const rustCandidate = await votingProgram.account.candidate.fetch(rustAddress);
    expect(rustCandidate.candidateVotes.toNumber()).toEqual(1);
  })
})
