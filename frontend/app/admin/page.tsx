'use client'

import * as React from "react";
import { UserAuth } from "@/context/AuthContext";
import { collection, getDocs, getFirestore, updateDoc, doc, query, where } from 'firebase/firestore';
import Spinner from "@/components/auth/Spinner";
import Redirect from "@/components/redrict";
import DataTable from "../../components/admin/DataTable";
import Redrict from "@/components/redrict";
import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/navbar/header";
import {AddItem} from "@/components/admin/AddItem";
import {AddCategory} from "@/components/admin/AddCategory";
import { ScrollArea } from "@/components/ui/scroll-area";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Users, Bid, Item} from "@/components/types/types";
import {useRouter} from "next/navigation";

const allowedEmails = ["filippo.vicini2@gmail.com", "test1234@test.com"];

const Page: React.FC = () => {
    const { user } = UserAuth();
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

    const fetchUsers = async () => {
        if (isAdmin) {
            const usersCollection = collection(getFirestore(), "users");

            try {
                const usersSnapshot = await getDocs(usersCollection);
                const usersData: Users[] = [];

                usersSnapshot.forEach((doc) => {
                    const data = doc.data() as Users;
                    usersData.push({ ...data, id: doc.id });
                });

                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, [isAdmin]);

    const deactivateUser = async (id: string) => {
        if (isAdmin) {
            const userDoc = doc(getFirestore(), "users", id);

            try {
                await updateDoc(userDoc, {
                    isActive: false
                });

                // Update the local state
                setUsers(prevUsers => prevUsers.map(user => {
                    if (user.id === id) {
                        return {
                            ...user,
                            isActive: false
                        };
                    }
                    return user;
                }));
            } catch (error) {
                console.error("Error deactivating user:", error);
            }
        }
        window.location.reload()
    };
    const enable = async (id: string) => {
        if (isAdmin) {
            const userDoc = doc(getFirestore(), "users", id);

            try {
                await updateDoc(userDoc, {
                    isActive: true
                });

                setUsers(prevUsers => prevUsers.map(user => {
                    if (user.id === id) {
                        return {
                            ...user,
                            isActive: false
                        };
                    }
                    return user;
                }));
            } catch (error) {
                console.error("Error deactivating user:", error);
            }
        }
        window.location.reload()
    };


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
                                    <hr/>
                                    <div className="mt-10">
                                    <h3 className="text-2xl mt-3 mb-3 font-bold">All users</h3>
                                    <DataTable users={users} deleteUser={deactivateUser} enableUser={enable}/>
                                    </div>
                                    <hr/>
                                    <div className="mt-10">
                                    <h3 className="text-2xl  mt-3 mb-3 font-bold">Adding to the Auction</h3>
                                    <AddItem/>
                                    <AddCategory/>
                                    </div>
                                    <hr className="mt-3 mb-3"/>
                                    <div className="mt-10">
                                    <h3 className="text-2xl mt-3 mb-3 font-bold">Manage Items</h3>
                                        <div className="grid gap-4 grid-cols-3 md:grid-cols-2 lg:grid-cols-5">
                                    {items.map((item) => (
                                        <Card key={item.id} className="col-span-1">
                                            <CardHeader>
                                                <CardTitle style={{ color: item.isActive ? 'green' : 'red' }}>{item.name}</CardTitle>
                                            </CardHeader>

                                            <CardContent className="pl-2">
                                                <div className="flex items-center space-x-2">
                                                    <p>Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Category: {item.category}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Condition: {item.condition}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Status: {item.status}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Active: {item.isActive ? 'Yes' : 'No'}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Starting Price: {item.startingPrice}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Current Price: {item.currentPrice}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>End date</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Start date</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Shipping Method: {item.shippingMethod}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Shipping Cost: {item.shippingCost}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Estimated Delivery Time: {item.estimatedDeliveryTime}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p>Description: {item.description}</p>
                                                </div>
                                                {/* Add other fields here */}
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div>
                                                        <img src={item.images[0]} alt={item.name} className="w-full h-auto" />
                                                    </div>
                                                    <div className="ml-4 flex flex-col justify-between">
                                                        <Button onClick={() => disableItem(item.id)} className="mb-2">
                                                            Disable
                                                        </Button>
                                                        <Button onClick={() => enableItem(item.id)} className="mb-2">
                                                            Enable
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                    ))}
                                        </div>
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
