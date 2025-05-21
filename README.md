# 🟧 SatsStaker

## Secure Bitcoin Yield Generation Protocol on Stacks

SatsStaker is a non-custodial staking protocol enabling users to earn yield on **sBTC**, a wrapped version of Bitcoin on the Stacks Layer 2 blockchain. Designed for security, transparency, and flexibility, SatsStaker allows anyone to earn time-weighted rewards while maintaining full ownership of their assets.

## 🌐 Overview

* **Staked Token**: sBTC (1:1 Bitcoin-pegged token on Stacks)
* **Network**: Stacks L2 (Clarity smart contracts)
* **Model**: Non-custodial, smart contract-based staking
* **Reward Source**: Configurable sBTC reward pool
* **Security**: Time-locked controls, principal-based access, error-safe design

## ⚙️ Core Features

* 🛡️ **Non-Custodial** – Users retain control; contract cannot access funds without explicit user action
* ⏱️ **Minimum Stake Period** – Enforced via block height to ensure staking commitment
* 📈 **Time-Weighted Rewards** – Linear accrual based on amount × duration
* 🎚️ **Admin Configurable** – Reward rates, periods, and ownership can be securely updated
* 🔁 **Compoundable Rewards** – Users can claim or auto-compound earnings

---

## 🏗️ Protocol Architecture

```text
+------------------------------+
|        User Wallet           |
+--------------+---------------+
               |
         [1] Stake sBTC
               |
               v
+--------------+---------------+
|         SatsStaker Contract  |
|  - stake(), unstake()        |
|  - claim-rewards()           |
|  - calculate-rewards()       |
|  - get-stake-info()          |
|                              |
|  State:                      |
|    - stakes: user → data     |
|    - rewards-claimed         |
|    - reward-pool             |
|    - reward-rate, min-period |
+--------------+---------------+
               |
         [2] sBTC transfer
               |
               v
+--------------+---------------+
|          sBTC Token Contract |
|  (SIP-010 Compliant Token)   |
+------------------------------+
```

---

## 📜 Contract Address

```
ST2VXPMB7WBJRS0HPJENJD7FR35907JV4X1E64DGN.sats-staker
```

---

## 🚀 Getting Started

### 🔧 Requirements

* [Clarinet](https://docs.hiro.so/clarinet)
* [Stacks.js](https://github.com/hirosystems/stacks.js) SDK
* sBTC Testnet Tokens (for dev/testing)

---

### 💰 Claiming Rewards

```clarity
(claim-rewards)
```

### 🔓 Unstaking

```clarity
(unstake amount)
```

---

## 🧮 Reward Model

```text
Rewards = (Staked Amount × Reward Rate) × (Stake Duration / Annual Blocks)
Where:
- Reward Rate = basisPoints / 1000
- Annual Blocks = 52560 (approx. 10-minute blocks)
```

---

## 📊 Read-Only Functions

| Function                    | Description                                 |
| --------------------------- | ------------------------------------------- |
| `get-stake-info(staker)`    | View a user’s stake details                 |
| `calculate-rewards(staker)` | Real-time reward preview                    |
| `get-rewards-claimed()`     | Track total claimed rewards                 |
| `get-reward-pool()`         | Current available sBTC for rewards          |
| `get-reward-rate()`         | Configured reward rate (basis points)       |
| `get-min-stake-period()`    | Required staking duration in blocks         |
| `get-total-staked()`        | Total sBTC currently staked in the contract |
| `get-current-apy()`         | Approximate APY based on current settings   |

---

## 🔐 Admin Functions

| Function                        | Purpose                                |
| ------------------------------- | -------------------------------------- |
| `set-reward-rate(rate)`         | Update reward rate (max 1000 = 100%)   |
| `set-min-stake-period(blocks)`  | Adjust the minimum staking duration    |
| `add-to-reward-pool(amount)`    | Fund rewards from admin’s sBTC balance |
| `set-contract-owner(new-owner)` | Transfer ownership rights              |

> ⚠️ Admin actions are time-locked or access-controlled for safety.

---

## ❗ Error Codes

| Code | Label                      | Description                        |
| ---- | -------------------------- | ---------------------------------- |
| u100 | `ERR_NOT_AUTHORIZED`       | Unauthorized admin action          |
| u101 | `ERR_ZERO_STAKE`           | Must stake more than 0             |
| u102 | `ERR_NO_STAKE_FOUND`       | No stake record exists             |
| u103 | `ERR_TOO_EARLY_TO_UNSTAKE` | Attempt to unstake before allowed  |
| u104 | `ERR_INVALID_REWARD_RATE`  | Reward rate exceeds safe threshold |
| u105 | `ERR_NOT_ENOUGH_REWARDS`   | Reward pool lacks sufficient funds |

---

## 🔐 Security & Audit Notes

* ✅ Reentrancy protection
* ✅ Integer overflow & underflow checks
* ✅ Basis point precision for rewards
* ✅ Reserve-backed reward pool
* ✅ Edge case validation on staking & timing

> Full audit documentation to be published prior to mainnet release.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`feature/my-feature`)
3. Commit changes and tests
4. Submit a pull request
