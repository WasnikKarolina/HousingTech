"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {UserOutlined} from "@ant-design/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAuth } from "@/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import { type Chain } from '@rainbow-me/rainbowkit';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';


import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const xrp = {
  id: 1440002 ,
  name: 'XRPL EVM Sidechain Devnet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-evm-sidechain.xrpl.org/'] },
  },
  blockExplorers: {
    default: { name: 'EVM sidechain explorer', url: 'https://evm-sidechain.xrpl.org/' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [xrp],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();


export function UserNav() {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const profileRef = useRef<HTMLButtonElement>(null);

  const [isProfileActive, setIsProfileActive] = useState(false);

  useEffect(() => {
    const handleProfile = (e: MouseEvent) => {
      if (
          profileRef.current &&
          !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileActive(false);
      }
    };
    document.addEventListener("click", handleProfile);

    return () => {
      document.removeEventListener("click", handleProfile);
    };
  }, []);

  return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center w-8 h-8 rounded-full bg-[#cfd4cf]">
              <Avatar className="h-16 w-16 flex items-center justify-center">
                <UserOutlined />
              </Avatar>
            </Button>

          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {loading ? null : !user ? (
                      <ul className="flex">
                        <li onClick={handleSignIn} className="p-2 cursor-pointer">
                          Login
                        </li>
                        <li onClick={handleSignIn} className="p-2 cursor-pointer">
                          Sign up
                        </li>
                      </ul>
                  ) : (
                      <div className="p-2 flex items-center">
                        <p className="text-[#00103a] ">
                          {user.email
                              ? user.email.length > 25
                                  ? `${user.email.slice(0, 25)}...`
                                  : user.email
                              : "name"}
                        </p>
                      </div>
                  )}
                </p>
                <p className="text-xs leading-none text-muted-foreground"></p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <a href="/profile">
                <DropdownMenuItem >
                  Profile
                </DropdownMenuItem>
              </a>
              <a href="/support">
                <DropdownMenuItem >
                  Support
                </DropdownMenuItem>
              </a>
              <DropdownMenuSeparator />
              <a href="/terms">
                <DropdownMenuItem>
                  Terms and Conditions
                </DropdownMenuItem>
              </a>
              <a href="/privacy">
                <DropdownMenuItem>
                  Privacy Policy
                </DropdownMenuItem>
              </a>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#1955D2]" onClick={handleSignOut}>
              Log out
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ConnectButton /> {/* Add the ConnectButton component here */}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ConnectButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

  );
}