# TipJar Smart Contracts

A collection of 10 on-chain tipping contracts deployed on Base Mainnet.

## Contracts

| Contract | Address | Description |
|----------|---------|-------------|
| TipJar | `0x66F4fb4C8F1B1D497D34855f3c7d41934b8A11EA` | Original tip jar with messages and emojis |
| TipSplitter | `0x8C1F3054739342A540c1dfd581b5efd03D1de5c1` | Split tips between multiple wallets |
| TipLeaderboard | `0x0886c4D0364BE61DC843833B0938eDC01Ca65571` | On-chain leaderboard of top tippers |
| TipVault | `0xda30b7A46a6706262c45A9ab0129114632DCC1C6` | Time-locked tip vault (7 days) |
| TipBadge | `0xcA9B3eD9c9e31820B6cA026da6C8e94e8f954dFd` | Badge rewards for tippers |
| TipMultiJar | `0x4C3885Ba32bAcA6Ff2662C31eA0515F643A05b39` | Multiple jars for different creators |
| TipEscrow | `0x68a183CdF297a3591657660e03753686e04aA481` | Tips held in escrow until task complete |
| TipDAO | `0x9aD9a4F3aE9A45A4823a88FfF52A5Ba91b21a052` | Community voting on fund usage |
| TipSubscription | `0xfd22D0a90Ca332E63797E2e856407bC3D74BfbEc` | Recurring subscription tips |
| TipWhitelist | `0xc8738a9f5D7F08356f420c239C943f5B819533a4` | Exclusive whitelist-only tipping |
| TipMessage | `0x97B7e59877acef2f29C0Df15E84e3CE1b85B3279` | Tips with public/private messages |

## Setup

```bash
npm install
cp .env.example .env
# Fill in PRIVATE_KEY, BASE_MAINNET_RPC_URL, BASESCAN_API_KEY
```

## Test

```bash
npx hardhat test
```

## Network

All contracts deployed on **Base Mainnet** (chainId: 8453)
- Explorer: https://basescan.org
- RPC: https://mainnet.base.org
