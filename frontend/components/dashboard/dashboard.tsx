"use client";

import { useWallet } from "@/components/providers/wallet-provider";
import { Navbar } from "@/components/navbar";

export function Dashboard({ children }: { children: React.ReactNode }) {
  const { address } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 pt-24 pb-16 mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Staking Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your sBTC stakes and rewards
          </p>
        </header>
        
        {children}
      </div>
    </div>
  );
}