'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthContextProvider } from "@/context/AuthContext";
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

const queryClient = new QueryClient();
const xrp = {
    id: 1440002,
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
} as const;

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [xrp],
    ssr: true,
});

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>

                    <head>
                        <meta name="description" />
                        <style>{`.${inter.className}`}</style>
                    </head>
                    <body className={inter.className}>
                    <AuthContextProvider>
                        {children}
                    </AuthContextProvider>
                    </body>

                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
        </html>

    )
}
