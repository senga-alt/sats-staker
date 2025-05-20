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

(define-read-only (get-contract-owner)
  (var-get contract-owner)
)

(define-public (set-contract-owner (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_NOT_AUTHORIZED)
    ;; Since this is a principal type, no additional validation needed but adding a check
    ;; to acknowledge the input was handled by validating the sender authorization
    (asserts! (not (is-eq new-owner (var-get contract-owner))) (ok true))
    (ok (var-set contract-owner new-owner))
  )
)

(define-public (set-reward-rate (new-rate uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_NOT_AUTHORIZED)
    (asserts! (< new-rate u1000) ERR_INVALID_REWARD_RATE) ;; Cannot be more than 100%
    (ok (var-set reward-rate new-rate))
  )
)

(define-public (set-min-stake-period (new-period uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_NOT_AUTHORIZED)
    ;; Add some basic validation for the new-period
    (asserts! (> new-period u0) ERR_INVALID_REWARD_RATE)
    (ok (var-set min-stake-period new-period))
  )
)

;; Add funds to the reward pool
(define-public (add-to-reward-pool (amount uint))
  (begin
    ;; Validate amount is greater than zero
    (asserts! (> amount u0) ERR_ZERO_STAKE)
    ;; Transfer sBTC to the contract
    (try! (contract-call? 'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token
      transfer amount tx-sender (as-contract tx-sender) none
    ))
    ;; Update reward pool - now the amount has been validated
    (var-set reward-pool (+ (var-get reward-pool) amount))
    (ok true)
  )
)