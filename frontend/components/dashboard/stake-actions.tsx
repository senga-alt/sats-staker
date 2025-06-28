"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRightLeft, TrendingUp, ArrowDown, AlertCircle, Coins, ExternalLink } from "lucide-react";
import { useWallet } from "@/components/providers/wallet-provider";
import { UserContractInterface } from "@/lib/contract-interface";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function StakeActions() {
  const { address } = useWallet();
  const { toast } = useToast();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("stake");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [balances, setBalances] = useState({
    sbtc: 0,
    staked: 0,
    rewards: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;
      
      try {
        setLoading(true);
        const [sbtcBalance, stakeInfo, rewards] = await Promise.all([
          UserContractInterface.getSbtcBalance(address),
          UserContractInterface.getStakeInfo(address),
          UserContractInterface.calculateRewards(address),
        ]);
        
        setBalances({
          sbtc: sbtcBalance || 0,
          staked: stakeInfo?.amount || 0,
          rewards: rewards || 0,
        });
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
    
    // Refresh balances every 30 seconds
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const handleStake = async () => {
    if (!address) return;
    
    try {
      setProcessing(true);
      const stakeAmountMicro = Math.floor(parseFloat(stakeAmount) * 100000000);

      if (balances.sbtc < stakeAmountMicro) {
        toast({
          variant: "destructive",
          title: "Insufficient Balance",
          description: "You don't have enough sBTC to stake this amount.",
        });
        return;
      }
      
      await UserContractInterface.stake(address, stakeAmountMicro);
      
      toast({
        title: "Staking Transaction Submitted",
        description: `Staking ${stakeAmount} sBTC. Please wait for confirmation.`,
      });
      
      setStakeAmount("");
      
      // Refresh balances after a delay
      setTimeout(() => {
        router.refresh();
      }, 3000);
      
    } catch (error) {
      console.error("Error staking sBTC:", error);
      toast({
        variant: "destructive",
        title: "Staking Failed",
        description: "There was an error while staking. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleUnstake = async () => {
    if (!address) return;
    
    try {
      setProcessing(true);
      const unstakeAmountMicro = Math.floor(parseFloat(unstakeAmount) * 100000000);
      
      if (balances.staked < unstakeAmountMicro) {
        toast({
          variant: "destructive",
          title: "Insufficient Staked Amount",
          description: "You don't have enough staked sBTC to unstake this amount.",
        });
        return;
      }
      
      await UserContractInterface.unstake(address, unstakeAmountMicro);
      
      toast({
        title: "Unstaking Transaction Submitted",
        description: `Unstaking ${unstakeAmount} sBTC. Please wait for confirmation.`,
      });
      
      setUnstakeAmount("");
      
      // Refresh balances after a delay
      setTimeout(() => {
        router.refresh();
      }, 3000);
      
    } catch (error) {
      console.error("Error unstaking sBTC:", error);
      
      if ((error as any)?.toString().includes("too early to unstake")) {
        toast({
          variant: "destructive",
          title: "Unstaking Failed",
          description: "Minimum staking period not yet reached. Please try again later.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Unstaking Failed",
          description: "There was an error while unstaking. Please try again.",
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!address) return;
    
    try {
      setProcessing(true);
      
      if (balances.rewards <= 0) {
        toast({
          variant: "destructive",
          title: "No Rewards Available",
          description: "You don't have any rewards to claim at this time.",
        });
        return;
      }
      
      await UserContractInterface.claimRewards(address);
      
      toast({
        title: "Claim Rewards Transaction Submitted",
        description: "Claiming your sBTC rewards. Please wait for confirmation.",
      });
      
      // Refresh balances after a delay
      setTimeout(() => {
        router.refresh();
      }, 3000);
      
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast({
        variant: "destructive",
        title: "Claiming Failed",
        description: "There was an error while claiming rewards. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const setMaxStake = () => {
    setStakeAmount((balances.sbtc / 100000000).toString());
  };

  const setMaxUnstake = () => {
    setUnstakeAmount((balances.staked / 100000000).toString());
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Manage your stakes and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Balance Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">sBTC Balance</div>
            <div className="font-semibold">
              {loading ? "..." : formatNumber(balances.sbtc / 100000000, 6)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Staked</div>
            <div className="font-semibold">
              {loading ? "..." : formatNumber(balances.staked / 100000000, 6)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Rewards</div>
            <div className="font-semibold text-[#F7931A]">
              {loading ? "..." : formatNumber(balances.rewards / 100000000, 6)}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="stake">
              <TrendingUp className="h-4 w-4 mr-2" />
              Stake
            </TabsTrigger>
            <TabsTrigger value="unstake">
              <ArrowDown className="h-4 w-4 mr-2" />
              Unstake
            </TabsTrigger>
            <TabsTrigger value="deposit">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Get sBTC
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stake">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="stake-amount">Amount to Stake (sBTC)</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={setMaxStake}
                    disabled={loading || balances.sbtc <= 0}
                  >
                    Max
                  </Button>
                </div>
                <Input
                  id="stake-amount"
                  type="number"
                  placeholder="0.0"
                  step="0.00000001"
                  min="0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
                <div className="text-xs text-muted-foreground">
                  Available: {formatNumber(balances.sbtc / 100000000, 8)} sBTC
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Staked sBTC earns yield over time. A minimum staking period of ~10 days applies.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleStake} 
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || processing || loading}
                className="w-full bg-[#F7931A] hover:bg-[#E67F00] text-white"
              >
                {processing ? "Processing..." : "Stake sBTC"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="unstake">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="unstake-amount">Amount to Unstake (sBTC)</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={setMaxUnstake}
                    disabled={loading || balances.staked <= 0}
                  >
                    Max
                  </Button>
                </div>
                <Input
                  id="unstake-amount"
                  type="number"
                  placeholder="0.0"
                  step="0.00000001"
                  min="0"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                />
                <div className="text-xs text-muted-foreground">
                  Staked: {formatNumber(balances.staked / 100000000, 8)} sBTC
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Unstaking will also claim any available rewards. Minimum staking period must be reached.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleUnstake} 
                disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || processing || loading}
                className="w-full bg-[#F7931A] hover:bg-[#E67F00] text-white"
              >
                {processing ? "Processing..." : "Unstake sBTC"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="deposit">
            <div className="space-y-4">
              <Alert className="bg-blue-500/10 text-blue-500 border-blue-500/50">
                <Coins className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  To stake Bitcoin, you first need to convert it to sBTC (Stacks Bitcoin) using the official bridge.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <h4 className="font-medium">How to get sBTC:</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Visit the official sBTC bridge</li>
                  <li>Connect your Bitcoin wallet</li>
                  <li>Deposit Bitcoin to receive sBTC</li>
                  <li>Return here to stake your sBTC</li>
                </ol>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button 
                className="w-full"
                onClick={() => window.open("https://bridge.sbtc.tech", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to sBTC Bridge
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => window.open("https://docs.stacks.co/sbtc", "_blank")}
              >
                Learn More About sBTC
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-6 flex flex-col space-y-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleClaimRewards}
          disabled={processing || loading || balances.rewards <= 0}
        >
          {processing ? "Processing..." : `Claim ${formatNumber(balances.rewards / 100000000, 6)} sBTC Rewards`}
        </Button>
        
        {balances.rewards > 0 && (
          <Badge variant="secondary" className="text-xs">
            ~${formatNumber((balances.rewards / 100000000) * 45000, 2)} USD value
          </Badge>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          Claiming rewards does not affect your staked sBTC amount
        </p>
      </CardFooter>
    </Card>
  );
}