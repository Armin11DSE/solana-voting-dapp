This is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install required packages:
```
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
```
anchor build
```

Then copy the "voting.so" file from "target/deploy" folder to "tests/fixtures".

Finally run this command in anchor folder:
```
anchor test
```

## Credits
Based on [Solana Developer Bootcamp 2024 - Learn Blockchain and Full Stack Web3 Development - Projects 1-9
](https://www.youtube.com/watch?v=amAq-WHAFs8)