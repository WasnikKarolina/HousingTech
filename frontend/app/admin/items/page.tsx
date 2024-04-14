'use client'

import * as React from "react";
import { UserAuth } from "@/context/AuthContext";
import { collection, getDocs, getFirestore, updateDoc, doc, query, where } from 'firebase/firestore';
import Spinner from "@/components/auth/Spinner";
import Router from "next/navigation";
import Redrict from "@/components/redrict";
import Sidebar from "../../../components/sidebar/sidebar";
import Header from "../../../components/navbar/header";

import { ScrollArea } from "@/components/ui/scroll-area";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {Users, Bid, Item} from "@/components/types/types";
import {useRouter} from "next/navigation";

const allowedEmails = ["filippo.vicini2@gmail.com", "chiccofdl05@gmail.com", "enzotrulli2005@gmail.com"];

const Page: React.FC = () => {
    const { user } = UserAuth();
    const router = useRouter();
    const userId = user ? user.uid : '';
    const [users, setUsers] = React.useState<Users[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [items, setItems] = useState<Item[]>([]);

    React.useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLoading(false);
        };

        if (user) {
            setIsAdmin(allowedEmails.includes(user.email));
        }

        checkAuthentication();
    }, [user]);



    useEffect(() => {
        const fetchItems = async () => {
            const firestore = getFirestore();
            const itemsCollection = collection(firestore, "items");

            try {
                const querySnapshot = await getDocs(itemsCollection);
                const itemsData: Item[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data() as Item;
                    itemsData.push({ ...data, id: doc.id });
                });

                setItems(itemsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching items:", error);
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const disableItem = async (id: string) => {
        if (isAdmin) {
            const itemDoc = doc(getFirestore(), "items", id);

            try {
                await updateDoc(itemDoc, {
                    isActive: false
                });

                setItems(prevItems => prevItems.map(item => {
                    if (item.id === id) {
                        return {
                            ...item,
                            isActive: false
                        };
                    }
                    return item;
                }));
            } catch (error) {
                console.error("Error deactivating item:", error);
            }
        }
        window.location.reload()
    };

    const enableItem = async (id: string) => {
        if (isAdmin) {
            const itemDoc = doc(getFirestore(), "items", id);

            try {
                await updateDoc(itemDoc, {
                    isActive: true
                });

                setItems(prevItems => prevItems.map(item => {
                    if (item.id === id) {
                        return {
                            ...item,
                            isActive: true
                        };
                    }
                    return item;
                }));
            } catch (error) {
                console.error("Error activating item:", error);
            }
        }
        window.location.reload()
    };
    const closedAuctions = items.filter((item) => {
        return item.status === 'Closed' || (item.endDate && new Date() > new Date(item.endDate));
    });
    const openAuctions = items.filter((item) => {
        return item.status === 'active' || (item.endDate && new Date() < new Date(item.endDate));
    });

    const handleUserClick = (userId: string | null | undefined) => {
        router.push(`/users/users?users=${userId}`);
    };


    return (
        <div>
            {loading ? (
                <Spinner />
            ) : user ? (
                isAdmin ? (
                    <div className="flex h-screen overflow-hidden">
                        <Sidebar />
                        <div className="flex flex-col w-full overflow-hidden">
                            <Header />
                            <ScrollArea className="h-full pt-16">

                                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                                    <div className="flex items-center justify-between space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tight text-[#00103A]">
                                            Hello Admin, Manage the auction
                                        </h2>
                                    </div>
                                    <br/>
                                    <hr className="mt-3 mb-3"/>
                                    <div className="mt-10">
                                        <h3 className="text-3xl mt-3 mb-3 font-bold">Manage Items</h3>
                                        <h3 className="text-3xl mt-3 mb-3 font-bold">Closed Auctions</h3>
                                        {closedAuctions.map((item) => (
                                            <Card key={item.id} className="col-span-1">
                                                <CardHeader>
                                                    <CardTitle>{item.name}</CardTitle>
                                                </CardHeader>
                                                <CardContent>

                                                    <p onClick={() => handleUserClick(item.winningUser)}>Winning User: {item.winningUser}</p>

                                                </CardContent>
                                            </Card>
                                        ))}

                                        <h3 className="text-3xl mt-3 mb-3 font-bold">Opened Auctions</h3>
                                        {openAuctions.map((item) => (
                                            <Card key={item.id} className="col-span-1">
                                                {/* Render details of each open auction */}
                                                <CardHeader>
                                                    <CardTitle>{item.name}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    {/* Render other details of the open auction */}
                                                </CardContent>
                                            </Card>
                                        ))}

                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                ) : (
                    <Redrict />
                )
            ) : (
                <Redrict />
            )}
        </div>
    );
};

export default Page;
