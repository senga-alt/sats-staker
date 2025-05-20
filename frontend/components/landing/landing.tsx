"use client";

import { useWallet } from "@/components/providers/wallet-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Bitcoin, 
  Shield, 
  TrendingUp, 
  Zap,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Navbar } from "../navbar";

export function Landing() {
  const { isWalletConnected } = useWallet();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isWalletConnected) {
      router.push("/dashboard");
    } else {
      // The wallet connection process will be handled by the WalletRequired component
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar transparent={scrollY < 50} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg" 
            alt="Bitcoin background"
            fill
            priority
            className="object-cover brightness-[0.2]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
        
        <div className="container relative z-20 px-4 max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F7931A] to-[#FFDC8F]">
                Earn Yield On Your Bitcoin
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
              SatsStaker provides a secure, non-custodial way to generate passive income from your Bitcoin assets on the Stacks platform.
            </p>
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-[#F7931A] hover:bg-[#E67F00] text-white shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
            >
              Start Staking Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/50">
        <div className="container px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Stake Your Bitcoin
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="h-10 w-10 text-[#F7931A]" />}
              title="Generate Yield"
              description="Earn passive income on your Bitcoin without giving up custody of your assets."
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-[#F7931A]" />}
              title="Non-Custodial"
              description="Your Bitcoin remains secure and under your control at all times."
            />
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-[#F7931A]" />}
              title="Low Fees"
              description="Minimal fees with maximum returns, optimizing your earning potential."
            />
            <FeatureCard 
              icon={<Bitcoin className="h-10 w-10 text-[#F7931A]" />}
              title="Stack Sats"
              description="Compound your Bitcoin holdings over time through staking rewards."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How SatsStaker Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              title="Deposit Bitcoin"
              description="Convert your Bitcoin to sBTC through our simple, guided process."
            />
            <StepCard 
              number="02"
              title="Stake Your sBTC"
              description="Choose your staking amount and lock period to start earning rewards."
            />
            <StepCard 
              number="03"
              title="Earn Rewards"
              description="Watch your rewards accumulate over time and claim them whenever you want."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0F172A]">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Bitcoin holders already generating passive income with SatsStaker.
          </p>
          <Button 
            onClick={handleGetStarted} 
            size="lg" 
            className="bg-[#F7931A] hover:bg-[#E67F00] text-white"
          >
            Launch App <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card/50 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Bitcoin className="h-6 w-6 text-[#F7931A] mr-2" />
              <span className="font-bold text-xl">SatsStaker</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} SatsStaker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:border-[#F7931A]/30 transition-all duration-300">
      <div className="h-16 w-16 rounded-lg bg-card-foreground/5 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative bg-card p-8 rounded-xl shadow-md border border-border">
      <div className="absolute -top-5 -left-5 h-14 w-14 rounded-full bg-[#F7931A] text-white flex items-center justify-center text-2xl font-bold">
        {number}
      </div>
      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}