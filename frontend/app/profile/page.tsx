"use client";

/*UI imports*/
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {message} from "antd";
/*Component Imports */
import Spinner from "@/components/auth/Spinner";

import PhoneSignup from "../../components/auth/PhoneNumber";

import { ScrollArea } from "@/components/ui/scroll-area";
/*Context Imports*/
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
    EmailAuthProvider,
    getAuth,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    updatePassword,
    GoogleAuthProvider, signInWithPopup,
} from "firebase/auth";
import {
    collection,
    getFirestore,
    deleteDoc,
    doc,
    setDoc,
    getDocs,
    query,
    where, getDoc,
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/sidebar/sidebar";
import Header from "@/components/navbar/header";

const Page = () => {

    const [forgotPasswordAccordion, setForgotPasswordAccordion] = useState(false);
    const { user, googleSignIn, emailSignIn, emailSignUp, logOut } = UserAuth();
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { push } = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [showPhoneNumberForm, setShowPhoneNumberForm] = useState(false);

    const handleSignIn = async () => {
        try {
            await emailSignIn(email, password);
            push("/dashboard")
        } catch (error) {
            message.error("Error signing in:" + error);
        }
    };

    const handleSignUp = async () => {
        try {
            await emailSignUp(email, password);

            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                const firestore = getFirestore();
                const usersCollection = collection(firestore, "users");

                const newUser = {
                    id: currentUser.uid,
                    isOnboarded: false,
                    email: currentUser.email,
                };

                await setDoc(doc(usersCollection, currentUser.uid), newUser);

                push("/dashboard");
            } else {
                message.error("User is not authenticated.");
            }
        } catch (error) {
            message.error("Error signing up:" + error);
        }
    };


    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            message.error("Error signing out:" + error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            message.error("Deleting account...");

            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                const confirmDeletion = window.confirm(
                    "Are you sure you want to delete your account?"
                );

                if (confirmDeletion) {
                    const firestore = getFirestore();
                    const usersCollection = collection(firestore, "users");
                    const containersCollection = collection(
                        firestore,
                        "containers",
                        user.uid,
                        "user_containers"
                    );
                    const spacesCollection = collection(
                        firestore,
                        "spaces",
                        user.uid,
                        "user_spaces"
                    );
                    const itemsCollection = collection(
                        firestore,
                        "items",
                        user.uid,
                        "user_items"
                    );

                    await deleteDoc(doc(usersCollection, currentUser.uid));

                    const containersQuery = query(
                        containersCollection,
                        where("userId", "==", currentUser.uid)
                    );
                    const containersSnapshot = await getDocs(containersQuery);
                    containersSnapshot.forEach(async (containerDoc) => {
                        await deleteDoc(containerDoc.ref);
                        const itemsQuery = query(
                            itemsCollection,
                            where("containerId", "==", containerDoc.id)
                        );
                        const itemsSnapshot = await getDocs(itemsQuery);
                        itemsSnapshot.forEach(async (itemDoc) => {
                            await deleteDoc(itemDoc.ref);
                        });
                    });

                    const spacesQuery = query(
                        spacesCollection,
                        where("userId", "==", currentUser.uid)
                    );
                    const spacesSnapshot = await getDocs(spacesQuery);
                    spacesSnapshot.forEach(async (spaceDoc) => {
                        await deleteDoc(spaceDoc.ref);
                    });

                    await currentUser.delete();
                }
            }
        } catch (error) {
            message.error("Error deleting account:" + error);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);

            const user = result.user;

            const firestore = getFirestore();
            const usersCollection = collection(firestore, "users");

            const newUser = {
                id: user.uid,
                isOnboarded: false,
                email: user.email,
                isActive: true,
            };
            await setDoc(doc(usersCollection, user.uid), newUser);

            push("/dashboard");
        } catch (error) {
            message.error("Error signing up with Google: " );
        }
    };

    const handleForgotPassword = async () => {
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, resetEmail);
            alert("Password reset email sent. Please check your inbox.");
        } catch (error) {
            console.error("Error sending password reset email:", error);
        }
    };

    const toggleForgotPasswordAccordion = () => {
        setForgotPasswordAccordion(!forgotPasswordAccordion);
    };

    const handleChangePassword = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                if (currentUser.email) {
                    const credential = EmailAuthProvider.credential(
                        currentUser.email,
                        currentPassword
                    );
                    await reauthenticateWithCredential(currentUser, credential);
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    await updatePassword(currentUser, newPassword);
                    alert("Password changed successfully!");
                } else {
                    message.error(
                        "User does not have an email associated with the account."
                    );
                }
            }
        } catch (error) {
            message.error("Error changing password:"+ error);
        }
    };

    useEffect(() => {
        const firestore = getFirestore();
        const checkAuthentication = async () => {

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Check if the user is admin
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

            setLoading(false);
        };

        checkAuthentication();
    }, [user]);

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : user && isActive  ? (
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex flex-col w-full overflow-hidden">
                        <Header />
                        <ScrollArea className="pt-16">
                            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                                <div className="flex items-center justify-between space-y-2">
                                    <div className="md:col-span-3">
                                        <div>
                                            <p>Welcome {user.email} you are logged in.</p>
                                            <Button
                                                onClick={handleSignOut}
                                                className="p-2 mt-4 cursor-pointer bg-[#00103A] text-white"
                                            >
                                                Sign Out
                                            </Button>
                                            <Button
                                                onClick={handleChangePassword}
                                                className="p-2 mt-4 ml-4 cursor-pointer bg-[#00103A] text-white"
                                            >
                                                Change password
                                            </Button>
                                            <Button
                                                onClick={handleDeleteAccount}
                                                className="p-2 mt-4 ml-4 cursor-pointer bg-red-500 text-white hover:bg-red-600"
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            ) : (
                <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-3 lg:px-0">
                    <Link
                        href="/examples/authentication"
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "absolute right-4 hidden top-4 md:right-8 md:top-8"
                        )}
                    >
                        Login
                    </Link>
                    <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex lg:justify-items-center lg:items-center">
                        {" "}
                        <div className="absolute inset-0 bg-zinc-900" />
                        <div className="z-20 text-3xl font-medium">
                           Alps Auctions
                        </div>

                    </div>
                    <div className="p-4 lg:p-8 grid grid col-span-2 h-full items-center">
                        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                            <div className="flex flex-col space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Join Alps Auctions
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your email below to create your account
                                </p>
                            </div>
                            <div className="mt-4 space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-2 w-full"
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-2 w-full"
                                />
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
                                    <Button
                                        onClick={handleSignIn}
                                        className="p-2 cursor-pointer text-white w-full bg-[#00103A]"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        onClick={handleSignUp}
                                        className="p-2 cursor-pointer text-white w-full bg-[#00103A] lg:mt-0 md:mt-0 mt-3 "
                                    >
                                        Sign up
                                    </Button>
                                </div>

                                <Button
                                    onClick={handleGoogleSignUp}
                                    className="p-2 cursor-pointer text-white w-full bg-black bg-[#00103A]"
                                >
                                    Sign up with Google
                                </Button>
                                <Button
                                    onClick={() => setShowPhoneNumberForm(!showPhoneNumberForm)}
                                    className="p-2 cursor-pointer text-white w-full bg-[#00103A] hover:bg-[#1955D2]"
                                >
                                    Sign up with Phone Number
                                </Button>
                            </div>
                            <div className="flex justify-center">
                                <p className="pl-2 text-sm  text-muted-foreground">
                                    Forgot your{" "}
                                    <a
                                        onClick={toggleForgotPasswordAccordion}
                                        className="text-[#1955D2] cursor-pointer"
                                    >
                                        Reset Password
                                    </a>
                                </p>
                            </div>

                            {forgotPasswordAccordion && (
                                <div className="mt-2">
                                    <p className="text-sm text-muted-foreground">
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="p-2 w-full"
                                        />
                                    </p>
                                </div>
                            )}

                            <p className="px-8 text-center text-sm text-muted-foreground">
                                By clicking continue, you agree to our{" "}
                                <Link
                                    href="/terms"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Privacy Policy
                                </Link>
                            </p>
                            {showPhoneNumberForm && <PhoneSignup />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;