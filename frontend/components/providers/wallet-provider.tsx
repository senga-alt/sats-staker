"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connect, disconnect, isConnected, request } from '@stacks/connect';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

// Define our own interface based on the actual response structure
interface AddressResponse {
  addresses: Array<{ address: string }>;
}

interface WalletContextType {
  address: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isWalletConnected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isWalletConnected: false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (isConnected()) {
        try {
          // Type assertion with a more generic type
          const response = await request('stx_getAddresses') as AddressResponse;
          const stacksAddress = response.addresses.find(
            (addr) => addr.address && addr.address.startsWith('SP')
          );
          if (stacksAddress) {
            setAddress(stacksAddress.address);
          }
        } catch (error) {
          console.error('Error getting addresses:', error);
        }
      }
      setInitialized(true);
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      // Type assertion with a more generic type
      const response = await connect({ forceWalletSelect: true }) as AddressResponse;
      
      if (response && response.addresses) {
        // Fix: Access the first address that starts with 'SP' (Stacks address)
        const stacksAddress = response.addresses.find(
          (addr) => addr.address && addr.address.startsWith('SP')
        );
        
        if (stacksAddress) {
          setAddress(stacksAddress.address);
          toast({
            title: "Wallet Connected",
            description: `Connected to ${stacksAddress.address.slice(0, 6)}...${stacksAddress.address.slice(-4)}`,
          });
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to your wallet. Please try again.",
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
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
      }}
    >
      {initialized ? children : <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-24 bg-primary/20 rounded"></div>
        </div>
      </div>}
    </WalletContext.Provider>
  );
};