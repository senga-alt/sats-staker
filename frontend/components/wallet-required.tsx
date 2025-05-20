"use client";

import { useWallet } from "@/components/providers/wallet-provider";
import { Button } from "@/components/ui/button";
import { Bitcoin } from "lucide-react";

export function WalletRequired({ children }: { children: React.ReactNode }) {
  const { isWalletConnected, connectWallet, connecting } = useWallet();

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Bitcoin className="h-10 w-10 text-[#F7931A]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              You need to connect your Stacks wallet to access the staking dashboard and earn yield on your sBTC.
            </p>
            <Button 
              size="lg" 
              onClick={connectWallet} 
              disabled={connecting}
              className="w-full bg-[#F7931A] hover:bg-[#E67F00] text-white"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}