"use client";

import {
  fetchCallReadOnlyFunction,
  contractPrincipalCV,
  cvToValue,
  uintCV,
  standardPrincipalCV,
  makeContractCall,
  AnchorMode,
  broadcastTransaction,
} from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";

// Contract info
const contractAddress = "ST2VXPMB7WBJRS0HPJENJD7FR35907JV4X1E64DGN";
const contractName = "sats-staker";
const sbtcContractAddress = "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT";
const sbtcContractName = "sbtc-token";

// Network - using testnet for now
const network = STACKS_TESTNET;

export const UserContractInterface = {
  // Read-only functions
  
  async getStakeInfo(userAddress: string) {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "get-stake-info",
        functionArgs: [standardPrincipalCV(userAddress)],
        network,
        senderAddress: userAddress,
      });
      
      const response = cvToValue(result);
      if (!response) return null;
      
      return {
        amount: response.value.amount.value,
        stakedAt: response.value["staked-at"].value,
      };
    } catch (error) {
      console.error("Error getting stake info:", error);
      return null;
    }
  },
  
  async calculateRewards(userAddress: string) {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "calculate-rewards",
        functionArgs: [standardPrincipalCV(userAddress)],
        network,
        senderAddress: userAddress,
      });
      
      const response = cvToValue(result);
      return response.value;
    } catch (error) {
      console.error("Error calculating rewards:", error);
      return 0;
    }
  },
  
  async getRewardRate() {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "get-reward-rate",
        functionArgs: [],
        network,
        senderAddress: contractAddress,
      });
      
      const response = cvToValue(result);
      return response.value;
    } catch (error) {
      console.error("Error getting reward rate:", error);
      return 5; // Default reward rate (0.5%)
    }
  },
  
  async getMinStakePeriod() {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "get-min-stake-period",
        functionArgs: [],
        network,
        senderAddress: contractAddress,
      });
      
      const response = cvToValue(result);
      return response.value;
    } catch (error) {
      console.error("Error getting min stake period:", error);
      return 1440; // Default min stake period
    }
  },
  
  async getTotalStaked() {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "get-total-staked",
        functionArgs: [],
        network,
        senderAddress: contractAddress,
      });
      
      const response = cvToValue(result);
      return response.value;
    } catch (error) {
      console.error("Error getting total staked:", error);
      return 0;
    }
  },
  
  async getSbtcBalance(userAddress: string) {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: sbtcContractAddress,
        contractName: sbtcContractName,
        functionName: "get-balance",
        functionArgs: [standardPrincipalCV(userAddress)],
        network,
        senderAddress: userAddress,
      });
      
      const response = cvToValue(result);
      return response.value;
    } catch (error) {
      console.error("Error getting sBTC balance:", error);
      return 0;
    }
  },
  
  // Public functions (require transactions)
  
  async stake(userAddress: string, amountMicroStx: number) {
    try {
      const txOptions = {
        contractAddress,
        contractName,
        functionName: "stake",
        functionArgs: [uintCV(amountMicroStx)],
        senderAddress: userAddress,
        network,
        anchorMode: AnchorMode.Any,
      };
      
      // In a real app, we would use @stacks/connect here to prompt the user to sign
      // For this example, we'll just log the transaction options
      console.log("Stake transaction options:", txOptions);
      
      // Mock a successful transaction result
      return { success: true };
    } catch (error) {
      console.error("Error staking sBTC:", error);
      throw error;
    }
  },
  
  async unstake(userAddress: string, amountMicroStx: number) {
    try {
      const txOptions = {
        contractAddress,
        contractName,
        functionName: "unstake",
        functionArgs: [uintCV(amountMicroStx)],
        senderAddress: userAddress,
        network,
        anchorMode: AnchorMode.Any,
      };
      
      // In a real app, we would use @stacks/connect here to prompt the user to sign
      console.log("Unstake transaction options:", txOptions);
      
      // Mock a successful transaction result
      return { success: true };
    } catch (error) {
      console.error("Error unstaking sBTC:", error);
      throw error;
    }
  },
  
  async claimRewards(userAddress: string) {
    try {
      const txOptions = {
        contractAddress,
        contractName,
        functionName: "claim-rewards",
        functionArgs: [],
        senderAddress: userAddress,
        network,
        anchorMode: AnchorMode.Any,
      };
      
      // In a real app, we would use @stacks/connect here to prompt the user to sign
      console.log("Claim rewards transaction options:", txOptions);
      
      // Mock a successful transaction result
      return { success: true };
    } catch (error) {
      console.error("Error claiming rewards:", error);
      throw error;
    }
  },
};