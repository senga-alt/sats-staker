"use client";

import { useState } from "react";
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
import { ArrowRightLeft, TrendingUp, ArrowDown, AlertCircle } from "lucide-react";
import { useWallet } from "@/components/providers/wallet-provider";
import { UserContractInterface } from "@/lib/contract-interface";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function StakeActions() {
  const { address } = useWallet();
  const { toast } = useToast();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("stake");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [sbtcDeposit, setSbtcDeposit] = useState(false);

  const handleStake = async () => {
    if (!address) return;
    
    try {
      setProcessing(true);

      // Check if the user has sBTC balance
      const sbtcBalance = await UserContractInterface.getSbtcBalance(address);
      const stakeAmountMicro = parseFloat(stakeAmount) * 100000000;

      if (sbtcBalance < stakeAmountMicro) {
        setSbtcDeposit(true);
        return;
      }
      
      // Call the contract to stake sBTC
      const result = await UserContractInterface.stake(address, stakeAmountMicro);
      
      toast({
        title: "Staking Successful",
        description: `Successfully staked ${stakeAmount} sBTC!`,
      });
      
      // Clear the input and refresh the page to show updated stakes
      setStakeAmount("");
      router.refresh();
      
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
      
      // Call the contract to unstake sBTC
      const unstakeAmountMicro = parseFloat(unstakeAmount) * 100000000;
      const result = await UserContractInterface.unstake(address, unstakeAmountMicro);
      
      toast({
        title: "Unstaking Successful",
        description: `Successfully unstaked ${unstakeAmount} sBTC!`,
      });
      
      // Clear the input and refresh the page to show updated stakes
      setUnstakeAmount("");
      router.refresh();
      
    } catch (error) {
      console.error("Error unstaking sBTC:", error);
      
      // Check if the error is due to the minimum stake period
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
      
      // Call the contract to claim rewards
      const result = await UserContractInterface.claimRewards(address);
      
      toast({
        title: "Rewards Claimed",
        description: "Successfully claimed your sBTC rewards!",
      });
      
      router.refresh();
      
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

  const handleSbtcDeposit = () => {
    setSbtcDeposit(false);
    setActiveTab("deposit");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Manage your stakes and rewards</CardDescription>
      </CardHeader>
      <CardContent>
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
              Deposit
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stake">
            {sbtcDeposit && (
              <Alert className="mb-4 bg-amber-500/10 text-amber-500 border-amber-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm mt-0">
                  You don't have enough sBTC balance. Convert your BTC to sBTC first.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stake-amount">Amount to Stake (sBTC)</Label>
                <Input
                  id="stake-amount"
                  type="number"
                  placeholder="0.0"
                  step="0.001"
                  min="0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Staked sBTC earns yield over time. A minimum staking period applies.
              </p>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleStake} 
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || processing}
                className="w-full bg-[#F7931A] hover:bg-[#E67F00] text-white"
              >
                {processing ? "Processing..." : "Stake sBTC"}
              </Button>
              
              {sbtcDeposit && (
                <Button 
                  variant="outline" 
                  onClick={handleSbtcDeposit}
                  className="w-full mt-2"
                >
                  Get sBTC First
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="unstake">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unstake-amount">Amount to Unstake (sBTC)</Label>
                <Input
                  id="unstake-amount"
                  type="number"
                  placeholder="0.0"
                  step="0.001"
                  min="0"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Unstaking will also claim any available rewards. Minimum staking period must be reached.
              </p>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleUnstake} 
                disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0 || processing}
                className="w-full bg-[#F7931A] hover:bg-[#E67F00] text-white"
              >
                {processing ? "Processing..." : "Unstake sBTC"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="deposit">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To stake Bitcoin, you first need to convert it to sBTC (Stacks Bitcoin).
              </p>
              
              <Alert className="bg-blue-500/10 text-blue-500 border-blue-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm mt-0">
                  Follow the step-by-step process to deposit BTC and receive sBTC that can be staked.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full"
                onClick={() => window.open("https://bridge.sbtc.tech", "_blank")}
              >
                Go to sBTC Bridge
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6 flex flex-col">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleClaimRewards}
          disabled={processing}
        >
          {processing ? "Processing..." : "Claim Available Rewards"}
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Claiming rewards does not affect your staked sBTC amount
        </p>
      </CardFooter>
    </Card>
  );
}