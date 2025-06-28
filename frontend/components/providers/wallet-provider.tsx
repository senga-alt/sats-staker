"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { useToast } from '@/hooks/use-toast';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface WalletContextType {
  address: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isWalletConnected: boolean;
  userSession: UserSession;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isWalletConnected: false,
  userSession,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (userSession.isSignInPending()) {
        try {
          const userData = await userSession.handlePendingSignIn();
          setAddress(userData.profile.stxAddress.testnet);
        } catch (error) {
          console.error('Error handling pending sign in:', error);
        }
      } else if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        setAddress(userData.profile.stxAddress.testnet);
      }
      setInitialized(true);
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      showConnect({
        appDetails: {
          name: 'SatsStaker',
          icon: '/favicon.ico',
        },
        redirectTo: '/',
        onFinish: () => {
          const userData = userSession.loadUserData();
          setAddress(userData.profile.stxAddress.testnet);
          toast({
            title: "Wallet Connected",
            description: `Connected to ${userData.profile.stxAddress.testnet.slice(0, 6)}...${userData.profile.stxAddress.testnet.slice(-4)}`,
          });
          setConnecting(false);
        },
        onCancel: () => {
          setConnecting(false);
        },
        userSession,
      });
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
    userSession.signUserOut();
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
        userSession,
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