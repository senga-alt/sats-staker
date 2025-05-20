"use client";

import { useWallet } from "./providers/wallet-provider";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Bitcoin, Moon, Sun, ChevronDown, Wallet, LogOut } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const { isWalletConnected, connectWallet, disconnectWallet, address, connecting } = useWallet();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        transparent ? "bg-transparent" : "bg-background/80 backdrop-blur-md border-b border-border"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Bitcoin className="h-6 w-6 text-[#F7931A] mr-2" />
              <span className="font-bold text-xl">SatsStaker</span>
            </Link>
            
            <nav className="hidden md:flex items-center ml-10 space-x-8">
              <Link 
                href="/" 
                className={cn(
                  "text-sm transition-colors",
                  transparent ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-foreground"
                )}
              >
                Home
              </Link>
              <Link 
                href="/dashboard" 
                className={cn(
                  "text-sm transition-colors",
                  transparent ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isWalletConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-full flex items-center"
                  >
                    <Wallet className="h-4 w-4 mr-2 text-[#F7931A]" />
                    <span className="hidden sm:inline">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={disconnectWallet}>
                    <LogOut className="h-4 w-4 mr-2" /> Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={connecting}
                className="bg-[#F7931A] hover:bg-[#E67F00] text-white"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}