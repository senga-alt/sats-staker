"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/components/providers/wallet-provider";
import { UserContractInterface } from "@/lib/contract-interface";
import { formatNumber } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  
  // Fix: Change the type to include a structured object for month and year data
  const [projectionData, setProjectionData] = useState<{
    month: Array<{ day: number; amount: number; earned: number }>;
    year: Array<{ month: number; amount: number; earned: number }>;
  }>({
    month: [],
    year: []
  });
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
      
      try {
        setLoading(true);
        
        // Get stake info and reward rate
        const stake = await UserContractInterface.getStakeInfo(address);
        const rewardRate = await UserContractInterface.getRewardRate();
        
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
      setProjectionData({ month: [], year: [] });
      return;
    }
    
    const satoshisPerBTC = 100000000;
    const stakedBTC = stakedAmount / satoshisPerBTC;
    
    // Monthly data - 30 days
    const monthlyData = Array.from({ length: 31 }, (_, i) => {
      const dayNumber = i;
      const dailyRate = rewardRate / 365;
      const projectedAmount = stakedBTC * Math.pow(1 + dailyRate/100, dayNumber);
      const earned = projectedAmount - stakedBTC;
      
      return {
        day: dayNumber,
        amount: projectedAmount,
        earned: earned,
      };
    });
    
    // Yearly data - 12 months
    const yearlyData = Array.from({ length: 13 }, (_, i) => {
      const monthNumber = i;
      const monthlyRate = rewardRate / 12;
      const projectedAmount = stakedBTC * Math.pow(1 + monthlyRate/100, monthNumber);
      const earned = projectedAmount - stakedBTC;
      
      return {
        month: monthNumber,
        amount: projectedAmount,
        earned: earned,
      };
    });
    
    setProjectionData({
      month: monthlyData,
      year: yearlyData
    });
  };
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as 'month' | 'year');
  };
  
  // Calculate the final projected amount after the timeframe
  const projectedFinalAmount = projectionData[timeframe]?.length > 0 
    ? projectionData[timeframe][projectionData[timeframe].length - 1].amount 
    : 0;
  
  const projectedEarnings = projectionData[timeframe]?.length > 0 
    ? projectionData[timeframe][projectionData[timeframe].length - 1].earned 
    : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Projected Rewards</CardTitle>
            <CardDescription>
              Based on current APY of {stakeInfo.rewardRate.toFixed(1)}%
            </CardDescription>
          </div>
          <Tabs defaultValue="month" className="w-[200px]" onValueChange={handleTimeframeChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="month">30 Days</TabsTrigger>
              <TabsTrigger value="year">12 Months</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-64 rounded bg-muted/30 animate-pulse" />
        ) : stakeInfo.staked <= 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-center">
            <div>
              <p>No staking data available</p>
              <p className="text-sm">Stake sBTC to see projected rewards</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-6 mt-2">
              <div>
                <div className="text-sm text-muted-foreground">
                  Projected Balance
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(projectedFinalAmount)} sBTC
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Projected Earnings
                </div>
                <div className="text-2xl font-bold text-[#F7931A]">
                  +{formatNumber(projectedEarnings)} sBTC
                </div>
              </div>
            </div>
            
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectionData[timeframe]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey={timeframe === 'month' ? 'day' : 'month'} 
                    label={timeframe === 'month' ? 'Days' : 'Months'} 
                  />
                  <YAxis 
                    tickFormatter={(value) => formatNumber(value, 4)}
                    domain={['dataMin', 'dataMax']}
                  />
                  <Tooltip 
                    formatter={(value) => [`${formatNumber(value as number, 8)} sBTC`, 'Amount']}
                    labelFormatter={(value) => 
                      timeframe === 'month' ? `Day ${value}` : `Month ${value}`
                    }
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#F7931A" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}