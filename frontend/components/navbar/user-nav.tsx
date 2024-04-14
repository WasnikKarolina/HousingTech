"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {UserOutlined} from "@ant-design/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {UserAuth} from "@/context/AuthContext";
import {useEffect, useRef, useState} from "react";
import {getDefaultConfig} from "tailwind-merge";
import {ConnectButton} from "@rainbow-me/rainbowkit";



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
              <ConnectButton />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ConnectButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

  );
}