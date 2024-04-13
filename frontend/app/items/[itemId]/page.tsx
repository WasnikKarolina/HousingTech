'use client'
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    getDoc,
    getFirestore,
    doc,
    updateDoc,
    serverTimestamp, setDoc, arrayUnion,
} from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';
import Redirect from '@/components/redrict';
import Spinner from '@/components/auth/Spinner';
import Sidebar from '@/components/sidebar/sidebar';
import Header from '@/components/navbar/header';
import { ArrowLeft } from 'lucide-react';
import { UserAuth } from '@/context/AuthContext';
import { uuidv4 } from "@firebase/util";
import { Users, Item, Bid } from "../../../components/types/types";

const allowedEmails = ["filippo.vicini2@gmail.com", "chiccofdl05@gmail.com", "enzotrulli2005@gmail.com"];

const ItemDetail: React.FC = () => {
    const { user } = UserAuth();
    const [isActive, setIsActive] = useState(false);
    const searchParams = useSearchParams();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [bids, setBids] = useState<Bid[]>([]);
    const specificItem = searchParams.get('items');
    const [isAdmin, setIsAdmin] = useState(false);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [newBid, setNewBid] = useState<Bid>({
        id: uuidv4(),
        itemId: "",
        userId: user.uid,
        bidAmount: 0,
        bidTime: new Date(),
    });
    const [winningBid, setWinningBid] = useState<Bid | null>(null);

    const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(parseFloat(e.target.value));
    };

    const handleSubmitBid = async () => {
        if (bidAmount <= 0) {
            console.error("Bid amount must be greater than zero.");
            return;
        }

        try {
            await handleBid(item!, bidAmount);
            setBids([...bids, newBid]);
        } catch (error) {
            console.error("Error submitting bid:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const firestore = getFirestore();

            if (user) {
                try {
                    const userRef = doc(firestore, "users", user.uid);
                    const userSnapshot = await getDoc(userRef);

                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data();
                        setIsActive(userData.isActive);
                    } else {
                        console.log("User document doesn't exist");
                    }
                } catch (error) {
                    console.error("Error retrieving user data:", error);
                }
            }

            try {
                const itemDocRef = doc(firestore, 'items', specificItem!);
                const itemDocSnapshot = await getDoc(itemDocRef);

                if (itemDocSnapshot.exists()) {
                    const itemData = itemDocSnapshot.data() as Item;
                    setItem(itemData);
                    setBids(itemData.bids || []);
                    setLoading(false);
                } else {
                    console.error('Item document does not exist');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching item details:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user, specificItem]);

    useEffect(() => {
        if (user) {
            setIsAdmin(allowedEmails.includes(user.email));
        }
    }, [user]);

    const handleBid = async (item: Item, newBidAmount: number) => {
        const firestore = getFirestore();

        try {
            if (user) {
                const bidDocRef = doc(
                    firestore,
                    `bids/${user.uid}/user_bids/${newBid.id}`,
                );
                const itemDocRef = doc(firestore, 'items', item.id);
                await updateDoc(itemDocRef, {
                    bids: arrayUnion({
                        userId: user.uid,
                        bidAmount: newBidAmount,
                        bidTime: new Date(),
                    }),
                });
                await setDoc(bidDocRef, {
                    ...newBid,
                    bidAmount: newBidAmount,
                    creationDate: serverTimestamp(),
                    updateDate: serverTimestamp(),
                });

                setNewBid({
                    id: uuidv4(),
                    userId: user.uid,
                    itemId: item.id,
                    bidAmount: 0,
                    bidTime: new Date(),
                });
            } else {
                console.error("User is not authenticated.");
            }
        } catch (error) {
            console.error("Error adding space document: ", error);
        }
    };
    useEffect(() => {
        const closeBidsAndDetermineWinner = async () => {
            if (item && item.endDate) {
                const endDateString = item.endDate.toString();
                const day = parseInt(endDateString.substring(0, 2), 10);
                const month = parseInt(endDateString.substring(2, 4), 10) - 1; // Months are 0-indexed in JavaScript
                const year = parseInt(endDateString.substring(4, 8), 10);

                const endDate = new Date(year, month, day);

                if (new Date() >= endDate && item.status !== 'Closed') {
                    const sortedBids = [...bids].sort((a, b) => b.bidAmount - a.bidAmount);
                    if (sortedBids.length > 0) {
                        const winningBid = sortedBids[0];
                        setWinningBid(winningBid);
                        console.log(`Winner: User ${winningBid.userId} with bid $${winningBid.bidAmount}`);

                        const firestore = getFirestore();
                        const itemDocRef = doc(firestore, 'items', item.id);
                        await updateDoc(itemDocRef, {
                            status: 'Closed',
                            winningUser: winningBid.userId,
                        });
                    } else {
                        console.log('No bids were placed for this item, but the deadline has passed.');
                        const firestore = getFirestore();
                        const itemDocRef = doc(firestore, 'items', item.id);
                        await updateDoc(itemDocRef, {
                            status: 'Closed',
                        });
                    }
                } else {
                    console.log('Bidding is still open for this item.');
                }
            }
        };

        closeBidsAndDetermineWinner();
    }, [item, bids]);









    if (loading) {
        return <Spinner/>;
    }

    return (
        <div>
            {user && isActive ? (
                <div className="flex h-screen overflow-hidden">
                    <Sidebar/>
                    <div className="flex flex-col w-full overflow-hidden">
                        <Header/>
                        <ScrollArea className="h-full pt-16">
                            <a href="/dashboard">
                                <ArrowLeft className="h-8 w-8 ml-4 mt-4"/>
                            </a>
                            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                                <div>
                                    <h2 className="text-xl font-bold">Item Details:</h2>
                                    {item ? (
                                        <div>
                                            <p>ID: {item.id}</p>
                                            <p>Name: {item.name}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            {item.status === 'Closed' || (item.endDate && new Date() > new Date(item.endDate)) ? (
                                                <p>Bidding closed</p>
                                            ) : (
                                                <div>
                                                    <h2 className="text-xl font-bold">Place Bid:</h2>
                                                    <div>
                                                        <input
                                                            type="number"
                                                            value={bidAmount}
                                                            onChange={handleBidAmountChange}
                                                            placeholder="Enter bid amount"
                                                        />
                                                        <button onClick={handleSubmitBid}>Place Bid</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p>No item found with the specific ID</p>
                                    )}

                                    {bids.length > 0 && (
                                        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                                            <h2 className="text-xl font-bold">Bids for this item:</h2>
                                            <ul>
                                                {bids.map((bid) => (
                                                    <li key={bid.id}>
                                                        User ID: {bid.userId}, Amount: {bid.bidAmount},
                                                        Time: {bid.bidTime.toString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            ) : (
                <Redirect/>
            )}
        </div>
    );
}

export default ItemDetail;
