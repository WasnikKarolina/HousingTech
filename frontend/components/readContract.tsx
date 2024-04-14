

import { useReadContract } from 'wagmi'

import { config } from '../config'

const abi = [
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
]

export default function ReadContract() {


    const { data: buyer, error} = useReadContract({
        ...config,
        chainId: 1440002,
        address: '0xEC1436e5C911ae8a53066DF5E1CC79A9d8F8A789',
        abi: abi,
        functionName: 'buyer',
        args: [],
    })

    const { data: seller } = useReadContract({
        ...config,
        chainId: 1440002,
        address: '0xEC1436e5C911ae8a53066DF5E1CC79A9d8F8A789',
        abi: abi,
        functionName: 'seller',
        args: [],
    })

    const { data: price } = useReadContract({
        ...config,
        chainId: 1440002,
        address: '0xEC1436e5C911ae8a53066DF5E1CC79A9d8F8A789',
        abi: abi,
        functionName: 'price',
        args: [],
    })

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div>
            <div>Buyer: {buyer?.toString()}</div>
            <div>Seller: {seller?.toString()}</div>
            <div>Price: {price?.toString()}</div>
        </div>
    )
}