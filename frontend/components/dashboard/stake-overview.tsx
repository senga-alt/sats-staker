"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/components/providers/wallet-provider";
import { Progress } from "@/components/ui/progress";
import { formatNumber, getReadableStxAddress } from "@/lib/utils";
import { UserContractInterface } from "@/lib/contract-interface";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Coins, Users } from "lucide-react";

export function StakeOverview() {
  const { address } = useWallet();
  const [stakeInfo, setStakeInfo] = useState<{
    staked: number;
    rewards: number;
    rewardRate: number;
    totalStaked: number;
    minStakePeriod: number;
    rewardPool: number;
    sbtcBalance: number;
  }>({
    staked: 0,
    rewards: 0,
    rewardRate: 0.5,
    totalStaked: 0,
    minStakePeriod: 1440,
    rewardPool: 0,
    sbtcBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStakeInfo = async () => {
      if (!address) return;
      
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          stake,
          rewards,
          rewardRate,
          totalStaked,
          minStakePeriod,
          rewardPool,
          sbtcBalance
        ] = await Promise.all([
          UserContractInterface.getStakeInfo(address),
          UserContractInterface.calculateRewards(address),
          UserContractInterface.getRewardRate(),
          UserContractInterface.getTotalStaked(),
          UserContractInterface.getMinStakePeriod(),
          UserContractInterface.getRewardPool(),
          UserContractInterface.getSbtcBalance(address),
        ]);
        
        setStakeInfo({
          staked: stake?.amount || 0,
          rewards: rewards || 0,
          rewardRate: rewardRate / 10, // Convert basis points to percentage
          totalStaked: totalStaked || 0,
          minStakePeriod: minStakePeriod || 1440,
          rewardPool: rewardPool || 0,
          sbtcBalance: sbtcBalance || 0,
        });
      } catch (error) {
        console.error("Error fetching stake info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStakeInfo();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchStakeInfo, 30000);
    return () => clearInterval(interval);
  }, [address]);

  // Calculate the user's share of the total stake
  const stakePercentage = stakeInfo.totalStaked > 0 
    ? (stakeInfo.staked / stakeInfo.totalStaked) * 100 
    : 0;

  // Calculate estimated APY
  const estimatedAPY = stakeInfo.rewardRate;

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Your Staked sBTC"
          value={loading ? "Loading..." : `${formatNumber(stakeInfo.staked / 100000000, 8)} sBTC`}
          description="Total amount you have staked"
          loading={loading}
          icon={<Coins className="h-5 w-5 text-[#F7931A]" />}
        />
        
        <StatsCard 
          title="Available Rewards"
          value={loading ? "Loading..." : `${formatNumber(stakeInfo.rewards / 100000000, 8)} sBTC`}
          description="Rewards ready to claim"
          loading={loading}
          highlight
          icon={<TrendingUp className="h-5 w-5 text-[#F7931A]" />}
        />
        
        <StatsCard 
          title="Current APY"
          value={loading ? "Loading..." : `${stakeInfo.rewardRate.toFixed(1)}%`}
          description="Annual percentage yield"
          loading={loading}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
        />
        
        <StatsCard 
          title="sBTC Balance"
          value={loading ? "Loading..." : `${formatNumber(stakeInfo.sbtcBalance / 100000000, 8)} sBTC`}
          description="Available to stake"
          loading={loading}
          icon={<Coins className="h-5 w-5 text-blue-500" />}
        />
      </div>

      {/* Protocol Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-[#F7931A]" />
              Total Protocol TVL
            </CardTitle>
            <CardDescription>
              Total value locked in the protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-2xl font-bold">
                {formatNumber(stakeInfo.totalStaked / 100000000, 2)} sBTC
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Reward Pool
            </CardTitle>
            <CardDescription>
              Available rewards for distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="text-2xl font-bold">
                {formatNumber(stakeInfo.rewardPool / 100000000, 2)} sBTC
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Min Stake Period
            </CardTitle>
            <CardDescription>
              Required staking duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {stakeInfo.minStakePeriod} blocks
                </div>
                <Badge variant="secondary" className="text-xs">
                  ~{Math.round(stakeInfo.minStakePeriod / 144)} days
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Your Share Visualization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Share of Total sBTC Staked</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${stakePercentage.toFixed(4)}% of ${formatNumber(stakeInfo.totalStaked / 100000000, 2)} sBTC total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={stakePercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F7931A]"></div>
                <span>Your Stake: {formatNumber(stakeInfo.staked / 100000000, 8)} sBTC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <span>Others: {formatNumber((stakeInfo.totalStaked - stakeInfo.staked) / 100000000, 2)} sBTC</span>
              </div>
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
  icon?: React.ReactNode;
}

function StatsCard({ title, value, description, loading = false, highlight = false, icon }: StatsCardProps) {
  return (
    <Card className={highlight ? "border-[#F7931A]/30 bg-[#F7931A]/5" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <div className={`text-2xl font-bold ${highlight ? "text-[#F7931A]" : ""}`}>
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}