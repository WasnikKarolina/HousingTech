'use client'
import React, { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";

// UI Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Custom Components
import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/navbar/header";
import Spinner from "@/components/auth/Spinner";
import Redrict from "@/components/redrict";

// Types
import { Item } from "@/components/types/types";

const Page: React.FC = () => {
    const router = useRouter();
    const { user } = UserAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleLearnMore = (itemId: string) => {
        router.push(`/items/items?items=${itemId}`);
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

            // Fetch items
            const itemsCollection = collection(firestore, "items");
            try {
                const querySnapshot = await getDocs(itemsCollection);
                const itemsData: Item[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data() as Item;
                    itemsData.push({ ...data, id: doc.id });
                });

                setItems(itemsData);
            } catch (error) {
                console.error("Error fetching items:", error);
            }

            setLoading(false);
        };

        fetchData();
    }, [user]);

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (

                <>
                    {user   ? (
                        <div className="flex h-screen overflow-hidden">
                            <Sidebar />
                            <div className="flex flex-col w-full overflow-hidden">
                                <Header />
                                <ScrollArea className="h-full pt-16">
                                    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                                        <div className="flex items-center justify-between space-y-2">
                                            <h2 className="text-3xl font-bold tracking-tight text-[#00103A]">
                                                All the items
                                            </h2>
                                        </div>
                                        <Tabs defaultValue="overview" className="space-y-4">
                                            <TabsContent value="overview" className="space-y-4">
                                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                                                    {items
                                                        .filter((item) => item.isActive)
                                                        .map((item) => (
                                                            <Card key={item.id} className="col-span-2">
                                                                <CardHeader>
                                                                    <CardTitle>{item.name}</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="pl-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <p>{item.quantity}</p>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <p>{item.category}</p>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <p>{item.condition}</p>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <p>{item.status}</p>
                                                                    </div>
                                                                    <div className="mt-4 flex items-center justify-between">
                                                                        <div>
                                                                            <img
                                                                                src={item.images[0]}
                                                                                alt={item.name}
                                                                                className="w-full h-auto"
                                                                            />
                                                                        </div>
                                                                        <div className="ml-4 flex flex-col justify-between">
                                                                            <Button className="mb-2">Bid</Button>
                                                                            <Button onClick={() => handleLearnMore(item.id)}>
                                                                                Learn More
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    ) : (
                        <Redrict /> // Redirect if user is not active or not authenticated
                    )}
                </>
            )}
        </div>
    );
};

export default Page;
