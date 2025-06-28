"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock wallet provider for development
interface WalletContextType {
  address: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isWalletConnected: boolean;
  userSession: any;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isWalletConnected: false,
  userSession: null,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setConnecting(true);
    try {
      // Simulate wallet connection for demo
      setTimeout(() => {
        const mockAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
        setAddress(mockAddress);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        });
        setConnecting(false);
      }, 1500);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to your wallet. Please try again.",
        variant: "destructive",
      });
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const isWalletConnected = !!address;

  return (
    <WalletContext.Provider
      value={{
        address,
        connecting,
        connectWallet,
        disconnectWallet,
        isWalletConnected,
        userSession: null,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};