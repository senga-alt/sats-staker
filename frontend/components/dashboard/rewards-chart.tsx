"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/components/providers/wallet-provider";
import { UserContractInterface } from "@/lib/contract-interface";
import { formatNumber } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

export function RewardsChart() {
  const { address } = useWallet();
  const [loading, setLoading] = useState(true);
  const [stakeInfo, setStakeInfo] = useState<{
    staked: number;
    stakedAt: number;
    rewardRate: number;
  }>({
    staked: 0,
    stakedAt: 0,
    rewardRate: 0.5,
  });
  
  const [projectionData, setProjectionData] = useState<{
    week: Array<{ day: number; amount: number; earned: number; cumulative: number }>;
    month: Array<{ day: number; amount: number; earned: number; cumulative: number }>;
    year: Array<{ month: number; amount: number; earned: number; cumulative: number }>;
  }>({
    week: [],
    month: [],
    year: []
  });
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
      
      try {
        setLoading(true);
        
        const [stake, rewardRate] = await Promise.all([
          UserContractInterface.getStakeInfo(address),
          UserContractInterface.getRewardRate()
        ]);
        
        setStakeInfo({
          staked: stake?.amount || 0,
          stakedAt: stake?.stakedAt || 0,
          rewardRate: rewardRate / 10, // Convert basis points to percentage
        });
        
        generateProjectionData(stake?.amount || 0, rewardRate / 10);
      } catch (error) {
        console.error("Error fetching data for chart:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [address]);
  
  const generateProjectionData = (stakedAmount: number, rewardRate: number) => {
    if (stakedAmount <= 0) {
      setProjectionData({ week: [], month: [], year: [] });
      return;
    }
    
    const satoshisPerBTC = 100000000;
    const stakedBTC = stakedAmount / satoshisPerBTC;
    const dailyRate = rewardRate / 365 / 100; // Convert to daily decimal rate
    
    // Weekly data - 7 days
    const weeklyData = Array.from({ length: 8 }, (_, i) => {
      const dayNumber = i;
      const projectedAmount = stakedBTC * Math.pow(1 + dailyRate, dayNumber);
      const earned = projectedAmount - stakedBTC;
      const dailyEarned = dayNumber > 0 ? (projectedAmount - stakedBTC * Math.pow(1 + dailyRate, dayNumber - 1)) : 0;
      
      return {
        day: dayNumber,
        amount: projectedAmount,
        earned: dailyEarned,
        cumulative: earned,
      };
    });
    
    // Monthly data - 30 days
    const monthlyData = Array.from({ length: 31 }, (_, i) => {
      const dayNumber = i;
      const projectedAmount = stakedBTC * Math.pow(1 + dailyRate, dayNumber);
      const earned = projectedAmount - stakedBTC;
      const dailyEarned = dayNumber > 0 ? (projectedAmount - stakedBTC * Math.pow(1 + dailyRate, dayNumber - 1)) : 0;
      
      return {
        day: dayNumber,
        amount: projectedAmount,
        earned: dailyEarned,
        cumulative: earned,
      };
    });
    
    // Yearly data - 12 months
    const yearlyData = Array.from({ length: 13 }, (_, i) => {
      const monthNumber = i;
      const days = monthNumber * 30; // Approximate days
      const projectedAmount = stakedBTC * Math.pow(1 + dailyRate, days);
      const earned = projectedAmount - stakedBTC;
      const monthlyEarned = monthNumber > 0 ? 
        (projectedAmount - stakedBTC * Math.pow(1 + dailyRate, (monthNumber - 1) * 30)) : 0;
      
      return {
        month: monthNumber,
        amount: projectedAmount,
        earned: monthlyEarned,
        cumulative: earned,
      };
    });
    
    setProjectionData({
      week: weeklyData,
      month: monthlyData,
      year: yearlyData
    });
  };
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as 'week' | 'month' | 'year');
  };
  
  // Calculate the final projected amount after the timeframe
  const currentData = projectionData[timeframe];
  const projectedFinalAmount = currentData?.length > 0 
    ? currentData[currentData.length - 1].amount 
    : 0;
  
  const projectedEarnings = currentData?.length > 0 
    ? currentData[currentData.length - 1].cumulative 
    : 0;

  // Calculate USD values (assuming $45,000 per BTC)
  const btcPrice = 45000;
  const projectedEarningsUSD = projectedEarnings * btcPrice;
  const projectedFinalAmountUSD = projectedFinalAmount * btcPrice;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#F7931A]" />
              Projected Rewards
            </CardTitle>
            <CardDescription>
              Based on current APY of {stakeInfo.rewardRate.toFixed(1)}%
            </CardDescription>
          </div>
          <Tabs defaultValue="month" className="w-[280px]" onValueChange={handleTimeframeChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">7 Days</TabsTrigger>
              <TabsTrigger value="month">30 Days</TabsTrigger>
              <TabsTrigger value="year">12 Months</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="w-full h-64" />
          </div>
        ) : stakeInfo.staked <= 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-center">
            <div className="space-y-2">
              <Calendar className="h-12 w-12 mx-auto opacity-50" />
              <p className="text-lg font-medium">No staking data available</p>
              <p className="text-sm">Stake sBTC to see projected rewards</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-[#F7931A]/10 to-[#F7931A]/5 rounded-lg border border-[#F7931A]/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  Projected Balance
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(projectedFinalAmount, 8)} sBTC
                </div>
                <div className="text-sm text-muted-foreground">
                  ~${formatNumber(projectedFinalAmountUSD, 2)} USD
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  Projected Earnings
                </div>
                <div className="text-2xl font-bold text-green-600">
                  +{formatNumber(projectedEarnings, 8)} sBTC
                </div>
                <div className="text-sm text-muted-foreground">
                  ~${formatNumber(projectedEarningsUSD, 2)} USD
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Cumulative Rewards Over Time</h4>
                <Badge variant="outline" className="text-xs">
                  {timeframe === 'week' ? '7 Days' : timeframe === 'month' ? '30 Days' : '12 Months'}
                </Badge>
              </div>
              
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={currentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F7931A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey={timeframe === 'year' ? 'month' : 'day'} 
                      label={{ 
                        value: timeframe === 'year' ? 'Months' : 'Days', 
                        position: 'insideBottom', 
                        offset: -5 
                      }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatNumber(value, 6)}
                      domain={['dataMin', 'dataMax']}
                      label={{ 
                        value: 'sBTC', 
                        angle: -90, 
                        position: 'insideLeft' 
                      }}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        `${formatNumber(value as number, 8)} sBTC`, 
                        name === 'cumulative' ? 'Total Rewards' : 'Amount'
                      ]}
                      labelFormatter={(value) => 
                        timeframe === 'year' ? `Month ${value}` : `Day ${value}`
                      }
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#F7931A" 
                      strokeWidth={2}
                      fill="url(#colorRewards)"
                      dot={false}
                      activeDot={{ r: 6, fill: "#F7931A" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}