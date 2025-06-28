"use client";

// Mock contract interface for development/demo
export const UserContractInterface = {
  // Read-only functions with mock data
  
  async getStakeInfo(userAddress: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      amount: 50000000, // 0.5 sBTC in satoshis
      stakedAt: 1000,
    };
  },
  
  async calculateRewards(userAddress: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return 2500000; // 0.025 sBTC rewards
  },
  
  async getRewardRate() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return 50; // 5.0% APY (50 basis points)
  },
  
  async getMinStakePeriod() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return 1440; // ~10 days in blocks
  },
  
  async getTotalStaked() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return 500000000000; // 5000 sBTC total staked
  },
  
  async getRewardPool() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return 100000000000; // 1000 sBTC reward pool
  },
  
  async getSbtcBalance(userAddress: string) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return 100000000; // 1.0 sBTC balance
  },
  
  // Public functions (simulate transactions)
  
  async stake(userAddress: string, amountMicroStx: number) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true };
  },
  
  async unstake(userAddress: string, amountMicroStx: number) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true };
  },
  
  async claimRewards(userAddress: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true };
  },
};