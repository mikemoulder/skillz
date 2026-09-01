# On-chain architecture

Applies when `components.onchain: true`. The entire discipline here is one question,
asked about every piece of data and every operation:

> Does this need to be verifiable by someone who does not trust us?

Yes → on-chain. No → a database. There is no third category, and "because it is a web3
hackathon" is not an answer that survives contact with a sponsor judge.

## The split

```text
ON-CHAIN                          OFF-CHAIN
ownership                         user profiles
balances, transfers               metadata, descriptions, images
rules that must be enforced       search indexes
proofs, commitments               analytics, logs
state two parties must share      anything you can regenerate
                                  anything nobody needs to verify
```

The most common mistake is writing a hash on-chain that nothing ever reads. It looks
like integration and reads, correctly, as **blockchain theater** — a database with a
worse latency profile and a gas bill. If you cannot name the party who verifies it and
the moment they do, take it off-chain.

The second most common: putting an entire JSON blob on-chain. Store the content
anywhere, put the hash on-chain, and only if someone checks that hash.

## Contract boundaries

Small, few, boring. A hackathon contract should be readable on a projector.

```text
Contract:
Purpose:              one sentence. if it needs "and", split it
State:                the minimum. every variable costs gas and audit surface
Functions:            the ones the demo calls, plus a view for the UI
Events:               one per state change. these ARE your UI's data source
Access control:       Ownable, or a single `require(msg.sender == x)`
```

**Do not build:** proxies and upgradeability (you will not upgrade in 36 hours, and a
misconfigured proxy bricks the demo), a custom token when an ERC-20 exists, a factory
before there is a second instance, or a governance module.

**Do use:** OpenZeppelin for anything standard. A hand-rolled ERC-20 is not technical
depth, it is a liability the sponsor judge will spot in ten seconds.

Emit an event on every state change. Events are how your frontend learns anything
happened without polling the chain, and they cost far less than storage.

## Transaction lifecycle

The part teams under-design, and where the demo actually breaks. Every write has five
states and your UI needs all of them:

```text
idle → signing (wallet open) → pending (broadcast, tx hash exists) → confirmed → failed
```

- **Signing** is where the user might reject. That is not an error, it is a normal
  outcome — never show a red error toast for a rejection.
- **Pending** is dead air on stage. Show the tx hash immediately, linked to the
  explorer, with a spinner attached to it. A visible hash reads as progress; a bare
  spinner reads as broken.
- **Confirmed** is your aha moment. Make it loud — the explorer link, the balance
  changing, the state updating. This is the beat the judge is scoring.
- **Failed** needs a plain sentence, never a raw revert string. `execution reverted:
  0x...` on a projector costs real points.

Design for optimistic UI: update the interface on broadcast, reconcile on confirmation.
Waiting for finality before showing anything makes a fast chain look slow.

## Reading chain state

Do not poll an RPC from the browser in a loop. Options, in order of hackathon
preference:

| Approach | Cost | Use when |
|---|---|---|
| Read once, then trust local state | 10 min | Almost always for a demo |
| Poll a route handler that caches | 30 min | State changes from outside your app |
| Listen to events in a worker → database | 2 hours | The demo shows external activity arriving |
| A hosted indexer (subgraph, etc.) | Half a day | Indexing is the product |

Anything past row two needs to earn itself. "We built an indexer" is a good line only
if the indexer is why the demo is impressive.

## Wallet and account model

Decide explicitly, in one line, which of these you are:

| Model | Fits |
|---|---|
| **User's own wallet** (injected/WalletConnect) | The user is the actor; ownership matters |
| **Backend signer** (a key in an env var) | Your service acts on its own behalf |
| **Smart account / session key** | An agent acts for a user under limits |

If an agent signs, that is the authorization boundary from
`references/agent-architecture.md`, and it is the first thing a sponsor judge will
ask about. Caps and an allowlist enforced in code, not in a prompt.

**Never a private key in the repo.** Not in `.env.example`, not in a comment, not "just
the testnet one" — testnet keys get pasted into mainnet configs later, and scanners
find committed keys within minutes.

## Testnet reality

Testnets are unreliable in ways mainnet is not, and always at the wrong moment:

- **Faucets rate-limit or run dry.** Get funds on day one, for every address, including
  the two you will create later. Getting testnet ETH at hour 30 is a coin flip.
- **RPCs go down** with no status page and no fix. Configure a fallback RPC from a
  different provider and switch on error.
- **Block times vary.** A chain that confirms in 2 seconds in rehearsal can take 30
  during a busy hour, and that is your demo's dead air.
- **Explorers lag.** Your link may 404 for a few seconds after broadcast. Show the hash
  as text too, so the screen is never empty.

The fallback that always works: **a real transaction, sent in advance, with its
explorer link ready.** If the live send stalls, cut to it — "here is one from ten
minutes ago" — and keep talking. That is a five-second cost instead of a dead pitch.

## Local development

```bash
anvil                         # local chain, instant blocks, funded accounts
forge test                    # fast enough to run on every save
forge script --broadcast      # deploy to testnet when the logic is settled
```

Develop against a local chain, deploy to testnet once the contract stops changing.
Testnet iteration is slow enough to cost you hours you will not notice losing.

Write down the deployed addresses somewhere shared the moment you deploy — a
`deployments.json` in the repo. The "which address is the frontend pointing at"
confusion is a real hour, usually lost at 3am with four people guessing.

## The questions a sponsor judge asks

Have the answers before Q&A:

```text
"What is actually on-chain here, and who verifies it?"
"Why does this need a chain rather than a database?"
"Who holds the keys, and what stops the agent overspending?"
"Is this deployed? What address? Can I see it on the explorer?"
```

That last one is asked constantly and answered badly. Have the explorer link open in a
tab. A verified contract on a block explorer is concrete proof you built the thing, and
verifying takes one command — do it while the deploy is fresh, not at hour 35.
