;; Title: SatsStaker - Secure Bitcoin Yield Generation Protocol
;;
;; Summary: A secure staking protocol for sBTC that generates yield for Bitcoin holders
;; on the Stacks Layer 2 platform, providing a non-custodial solution for earning 
;; passive income on Bitcoin assets.
;;
;; Description: 
;; This contract enables users to stake their sBTC (wrapped Bitcoin on Stacks) 
;; and earn proportional rewards based on time staked and amount. The protocol 
;; implements minimum staking periods, flexible reward rates, and secure
;; administration controls to ensure the long-term sustainability and security
;; of the protocol. SatsStaker bridges the traditional benefits of yield farming
;; with the security and sovereignty principles of Bitcoin.
;;

;; Error codes
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_ZERO_STAKE (err u101))
(define-constant ERR_NO_STAKE_FOUND (err u102))
(define-constant ERR_TOO_EARLY_TO_UNSTAKE (err u103))
(define-constant ERR_INVALID_REWARD_RATE (err u104))
(define-constant ERR_NOT_ENOUGH_REWARDS (err u105))

;; Data maps and variables
(define-map stakes
  { staker: principal }
  {
    amount: uint,
    staked-at: uint,
  }
)

(define-map rewards-claimed
  { staker: principal }
  { amount: uint }
)

(define-data-var reward-rate uint u5) ;; 0.5% in basis points (5/1000)
(define-data-var reward-pool uint u0)
(define-data-var min-stake-period uint u1440) ;; Minimum stake period in blocks (approx. 10 days on mainnet)
(define-data-var total-staked uint u0)

;; Administrative Functions

(define-data-var contract-owner principal tx-sender)