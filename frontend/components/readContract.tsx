import { useReadContract } from 'wagmi'
import { config } from '../config'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";

const abi =[
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_seller",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "OfferAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "OfferInitiated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "acceptOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyer",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "initiateOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "offerAccepted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "price",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "seller",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export default function ReadContract() {
    const { data: buyer, error: buyerError } = useReadContract({
        ...config,
        chainId: 1440002,
        address: '0xEC1436e5C911ae8a53066DF5E1CC79A9d8F8A789',
        abi: abi,
        functionName: 'buyer',
        args: [],
    });

    const { data: seller, error: sellerError } = useReadContract({
        ...config,
        chainId: 1440002,
        address: '0x2298542aEcd6dEF46e2562c58A4596752D3DA9c8',
        abi: abi,
        functionName: 'seller',
        args: [],
    });

    const { data: price, error: priceError } = useReadContract({
        ...config,
        chainId: 1440002,
        address: '0xEC1436e5C911ae8a53066DF5E1CC79A9d8F8A789',
        abi: abi,
        functionName: 'price',
        args: [],
    });

    if (buyerError || sellerError || priceError) {
        return <div>Error: {buyerError?.message || sellerError?.message || priceError?.message}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <h1>Housing tech Buying service</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="mb-2">Buyer</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <p className="text-lg">{buyer?.toString() || 'Ojas'}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="mb-2">Seller</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <p className="text-lg">{seller?.toString() || 'Filippo'}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="mb-2">Price</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <p className="text-lg">{price?.toString() || '50k xrp'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
