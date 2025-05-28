# Project Overview

This is a voting dApp created with `create-solana-dapp`, built upon the counter example.

## Getting Started

First, install required packages:

```bash
npm install --legacy-peer-deps
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests

First build by running this command in anchor folder:

```bash
anchor build
```

Then copy the "voting.so" file from "target/deploy" folder to "tests/fixtures".

Finally run this command in anchor folder:

```bash
anchor test
```

## Testing with Dialect (Blinks & Actions)

This project includes Dialect Blinks and Actions for seamless interaction via wallets and messaging platforms.
To test them locally:

1. Start your local validator:

```bash
solana-test-validator
```

2. Test the Anchor program:

```bash
anchor test --skip-local-validator
```

3.  Test Actions/Blinks with Dialect Dev Tools:

Go to <https://dial.to/?action=solana-action:http://localhost:3000/api/vote>

## Credits

Based on [Solana Developer Bootcamp 2024 - Learn Blockchain and Full Stack Web3 Development - Projects 1-9](https://www.youtube.com/watch?v=amAq-WHAFs8)
