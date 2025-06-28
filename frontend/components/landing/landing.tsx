"use client";

import { useWallet } from "@/components/providers/wallet-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  Bitcoin, 
  Shield, 
  TrendingUp, 
  Zap,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Users,
  Lock,
  Clock
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Navbar } from "../navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserContractInterface } from "@/lib/contract-interface";
import { formatNumber } from "@/lib/utils";

export function Landing() {
  const { isWalletConnected } = useWallet();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [protocolStats, setProtocolStats] = useState({
    totalStaked: 0,
    rewardPool: 0,
    currentAPY: 0.5,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProtocolStats = async () => {
      try {
        const [totalStaked, rewardPool, rewardRate] = await Promise.all([
          UserContractInterface.getTotalStaked(),
          UserContractInterface.getRewardPool(),
          UserContractInterface.getRewardRate(),
        ]);
        
        setProtocolStats({
          totalStaked: totalStaked || 0,
          rewardPool: rewardPool || 0,
          currentAPY: (rewardRate || 5) / 10,
        });
      } catch (error) {
        console.error("Error fetching protocol stats:", error);
      }
    };

    fetchProtocolStats();
  }, []);

  const handleGetStarted = () => {
    if (isWalletConnected) {
      router.push("/dashboard");
    } else {
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10" />
        
        <div className="container relative z-20 px-4 max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-[#F7931A] border-[#F7931A]/30 bg-[#F7931A]/10">
                🚀 Now Live on Stacks Testnet
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F7931A] to-[#FFDC8F]">
                  Earn Yield On Your Bitcoin
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                SatsStaker provides a secure, non-custodial way to generate passive income from your Bitcoin assets on the Stacks platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="bg-[#F7931A] hover:bg-[#E67F00] text-white shadow-lg transition-all duration-300 hover:translate-y-[-2px] text-lg px-8 py-6"
              >
                Start Staking Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
            
            {/* Protocol Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <div className="text-2xl font-bold text-[#F7931A]">
                  {formatNumber(protocolStats.totalStaked / 100000000, 2)} sBTC
                </div>
                <div className="text-sm text-muted-foreground">Total Value Locked</div>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <div className="text-2xl font-bold text-green-500">
                  {protocolStats.currentAPY.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Current APY</div>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <div className="text-2xl font-bold text-blue-500">
                  {formatNumber(protocolStats.rewardPool / 100000000, 2)} sBTC
                </div>
                <div className="text-sm text-muted-foreground">Reward Pool</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/30">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SatsStaker
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on Stacks, secured by Bitcoin. Experience the future of Bitcoin yield generation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="h-10 w-10 text-[#F7931A]" />}
              title="Generate Yield"
              description="Earn passive income on your Bitcoin without giving up custody of your assets."
              highlight
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-green-500" />}
              title="Non-Custodial"
              description="Your Bitcoin remains secure and under your control at all times."
            />
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-blue-500" />}
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
      <section id="how-it-works" className="py-24">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How SatsStaker Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and transparent. Start earning yield on your Bitcoin in three easy steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              title="Get sBTC"
              description="Convert your Bitcoin to sBTC through the official bridge. sBTC is a 1:1 Bitcoin-backed token on Stacks."
              icon={<ArrowRight className="h-6 w-6" />}
            />
            <StepCard 
              number="02"
              title="Stake Your sBTC"
              description="Choose your staking amount and lock period to start earning rewards. Minimum 10-day commitment required."
              icon={<Lock className="h-6 w-6" />}
            />
            <StepCard 
              number="03"
              title="Earn Rewards"
              description="Watch your rewards accumulate over time and claim them whenever you want. Compound for maximum returns."
              icon={<TrendingUp className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-card/30">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Built for Security & Trust
              </h2>
              <p className="text-lg text-muted-foreground">
                SatsStaker is built on Stacks, inheriting Bitcoin's security while enabling smart contract functionality.
              </p>
              
              <div className="space-y-4">
                <SecurityFeature 
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="Bitcoin-Secured"
                  description="Inherits Bitcoin's security through Stacks' unique consensus mechanism"
                />
                <SecurityFeature 
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="Open Source"
                  description="Fully auditable smart contracts with transparent operations"
                />
                <SecurityFeature 
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="Non-Custodial"
                  description="You maintain full control of your assets at all times"
                />
                <SecurityFeature 
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="Time-Locked"
                  description="Minimum staking periods ensure protocol stability"
                />
              </div>
            </div>
            
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6 text-[#F7931A]" />
                  Protocol Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-[#F7931A]">100%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">0</div>
                    <div className="text-sm text-muted-foreground">Exploits</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Smart Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#F7931A]/10 to-[#FFDC8F]/10">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Join the future of Bitcoin yield generation. Start staking your sBTC today and earn passive income on your Bitcoin holdings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-[#F7931A] hover:bg-[#E67F00] text-white text-lg px-8 py-6"
            >
              Launch App <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => window.open("https://docs.stacks.co/sbtc", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn About sBTC
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Bitcoin className="h-6 w-6 text-[#F7931A] mr-2" />
                <span className="font-bold text-xl">SatsStaker</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Secure Bitcoin yield generation on Stacks
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Protocol</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground">Documentation</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Smart Contract</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Security</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground">sBTC Bridge</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Stacks Explorer</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Support</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground">Discord</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Twitter</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">GitHub</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SatsStaker. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, highlight = false }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] ${
      highlight ? "border-[#F7931A]/30 bg-[#F7931A]/5" : ""
    }`}>
      <CardHeader>
        <div className="h-16 w-16 rounded-lg bg-card-foreground/5 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description, icon }: { 
  number: string; 
  title: string; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative transition-all duration-300 hover:shadow-lg">
      <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-[#F7931A] text-white flex items-center justify-center text-xl font-bold">
        {number}
      </div>
      <CardHeader className="pt-8">
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function SecurityFeature({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}