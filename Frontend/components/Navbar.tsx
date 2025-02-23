"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Menu, X, Package } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const mainConnector = connectors[0];

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: mainConnector });
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">DeliverChain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
            <Link
              href="/deliveries"
              className="text-sm lg:text-base text-gray-700 hover:text-primary transition-colors"
            >
              Deliveries
            </Link>
            <Link href="/track" className="text-sm lg:text-base text-gray-700 hover:text-primary transition-colors">
              Track
            </Link>
            <Link href="/about" className="text-sm lg:text-base text-gray-700 hover:text-primary transition-colors">
              About
            </Link>
            <Button
              onClick={handleConnectWallet}
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-sm lg:text-base"
            >
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-primary">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link
              href="/deliveries"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Deliveries
            </Link>
            <Link
              href="/track"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Track
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="px-3 py-2">
              <Button onClick={handleConnectWallet} variant="default" className="w-full bg-primary hover:bg-primary/90">
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}