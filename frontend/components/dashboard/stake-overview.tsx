"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/components/providers/wallet-provider";
import { Progress } from "@/components/ui/progress";
import { formatNumber, getReadableStxAddress } from "@/lib/utils";
import { fetchCallReadOnlyFunction } from '@stacks/transactions/dist/esm';
import { UserContractInterface } from "@/lib/contract-interface";

export function StakeOverview() {
  const { address } = useWallet();
  const [stakeInfo, setStakeInfo] = useState<{
    staked: number;
    rewards: number;
    rewardRate: number;
    totalStaked: number;
    minStakePeriod: number;
  }>({
    staked: 0,
    rewards: 0,
    rewardRate: 0.5,
    totalStaked: 0,
    minStakePeriod: 1440,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStakeInfo = async () => {
      if (!address) return;
      
      try {
        setLoading(true);
        
        // Call contract to get staking info
        const stake = await UserContractInterface.getStakeInfo(address);
        const rewards = await UserContractInterface.calculateRewards(address);
        const rewardRate = await UserContractInterface.getRewardRate();
        const totalStaked = await UserContractInterface.getTotalStaked();
        const minStakePeriod = await UserContractInterface.getMinStakePeriod();
        
        setStakeInfo({
          staked: stake?.amount || 0,
          rewards: rewards || 0,
          rewardRate: rewardRate / 10, // Convert basis points to percentage
          totalStaked: totalStaked || 0,
          minStakePeriod: minStakePeriod || 1440,
        });
      } catch (error) {
        console.error("Error fetching stake info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStakeInfo();
  }, [address]);

  // Calculate the user's share of the total stake
  const stakePercentage = stakeInfo.totalStaked > 0 
    ? (stakeInfo.staked / stakeInfo.totalStaked) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Your Staked sBTC"
        value={loading ? "Loading..." : `${formatNumber(stakeInfo.staked / 100000000)} sBTC`}
        description="Total amount you have staked"
        loading={loading}
      />
      
      <StatsCard 
        title="Available Rewards"
        value={loading ? "Loading..." : `${formatNumber(stakeInfo.rewards / 100000000)} sBTC`}
        description="Rewards ready to claim"
        loading={loading}
        highlight
      />
      
      <StatsCard 
        title="Current APY"
        value={loading ? "Loading..." : `${stakeInfo.rewardRate.toFixed(1)}%`}
        description="Annual percentage yield"
        loading={loading}
      />
      
      <StatsCard 
        title="Minimum Stake Period"
        value={loading ? "Loading..." : `${stakeInfo.minStakePeriod} blocks`}
        description="~10 days on mainnet"
        loading={loading}
      />

      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Share of Total sBTC Staked</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${stakePercentage.toFixed(2)}% of ${formatNumber(stakeInfo.totalStaked / 100000000)} sBTC total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={stakePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <div>{formatNumber(stakeInfo.staked / 100000000)} sBTC (You)</div>
              <div>{formatNumber(stakeInfo.totalStaked / 100000000)} sBTC (Total)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  loading?: boolean;
  highlight?: boolean;
}

function StatsCard({ title, value, description, loading = false, highlight = false }: StatsCardProps) {
  return (
    <Card className={highlight ? "border-[#F7931A]/30" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 bg-muted/30 rounded animate-pulse" />
        ) : (
          <div className={`text-2xl font-bold ${highlight ? "text-[#F7931A]" : ""}`}>
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}