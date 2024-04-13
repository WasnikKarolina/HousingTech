'use client'

import { useSearchParams } from 'next/navigation';
import Spinner from "@/components/auth/Spinner";
import Sidebar from "@/components/sidebar/sidebar";
import Header from "@/components/navbar/header";
import {ScrollArea} from "@/components/ui/scroll-area";
import { collection, getDocs, getFirestore, query, where, CollectionReference, DocumentData } from "firebase/firestore";
import Redirect from "@/components/redrict";
import * as React from "react";
import {UserAuth} from "@/context/AuthContext";
import { ArrowLeft } from 'lucide-react'

import {useState} from "react";

import {Item,  Users} from "@/components/types/types";

const allowedEmails = ["filippo.vicini2@gmail.com", "chiccofdl05@gmail.com", "enzotrulli2005@gmail.com"];
export default function UsersDetail() {
    const { user } = UserAuth();
    const userId = user ? user.uid : '';
    const [users, setUsers] = React.useState<Users[]>([]);
    const searchParams = useSearchParams();

    const [items, setItems] = useState<Item[]>([]);

    const DetailUserId = searchParams.get('users');
    const [loading, setLoading] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLoading(false);
        };

        if (user) {
            setIsAdmin(allowedEmails.includes(user.email));
        }

        checkAuthentication();


    }, [ user, DetailUserId]);



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
                                <a href={"/admin"}>
                                    <ArrowLeft className="h-8 w-8 ml-4 mt-4"  />
                                </a>
                                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                                    <div className="flex items-center justify-between space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tight text-[#00103A]">
                                            This is user: {DetailUserId}
                                        </h2>
                                    </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Containers:</h2>
                                            <ul className="list-disc ml-6">

                                            </ul>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Spaces:</h2>
                                            <ul className="list-disc ml-6">

                                            </ul>
                                        </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Items:</h2>
                                        <ul className="list-disc ml-6">
                                            {items.map((item) => (
                                                <li key={item.id}>{item.name}</li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                ) : (
                    <Redirect />
                )
            ) : (
                <Redirect />
            )}
        </div>
    );
};
