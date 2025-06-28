"use client";

import { useWallet } from "@/components/providers/wallet-provider";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";
import { UserContractInterface } from "@/lib/contract-interface";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";

export function Dashboard({ children }: { children: React.ReactNode }) {
  const { address } = useWallet();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('connected');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const checkConnection = async () => {
      if (!address) return;
      
      try {
        // Try to fetch a simple read-only function to test connection
        await UserContractInterface.getRewardRate();
        setConnectionStatus('connected');
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Connection check failed:', error);
        setConnectionStatus('error');
      }
    };

    // Check connection immediately
    checkConnection();
    
    // Check connection every 60 seconds
    const interval = setInterval(checkConnection, 60000);
    
    return () => clearInterval(interval);
  }, [address]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 pt-24 pb-16 mx-auto max-w-7xl">
        {/* Connection Status */}
        {connectionStatus === 'error' && (
          <Alert className="mb-6 bg-red-500/10 text-red-500 border-red-500/50">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              Connection to Stacks network is experiencing issues. Some data may be outdated.
            </AlertDescription>
          </Alert>
        )}
        
        {connectionStatus === 'connected' && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Staking Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your sBTC stakes and rewards
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="h-4 w-4 text-green-500" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Staking Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your sBTC stakes and rewards
            </p>
          </header>
        )}
        
        {children}
      </div>
    </div>
  );
}