import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./types";
import { Icons } from "./Icons";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { UserAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import {User} from 'lucide-react';

const allowedEmails = ["filippo.vicini2@gmail.com", "test1234@test.com"];

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const { user } = UserAuth();
  const path = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!items?.length) {
    return null;
  }

  return (
      <nav className="grid items-start gap-2">
        {items.map((item, index) => {
          const IconComponent = Icons[item.icon || "arrowRight"];

          return (
              item.href && (
                  <Link
                      key={index}
                      href={item.disabled ? "/" : item.href}
                      onClick={() => {
                        if (setOpen) setOpen(false);
                      }}
                  >
              <span
                  className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground blue",
                      path === item.href ? "bg-accent" : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                  )}
              >
                {IconComponent && <IconComponent className="mr-2 h-4 w-4 text-[#00103a]" />}
                <span>{item.title}</span>
              </span>
                  </Link>
              )
          );
        })}
        {isAdmin && (
            <Link href="/admin">
          <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground blue">
            <User className="mr-2 h-4 w-4 text-[#00103a]" />
            <span>Admin</span>
          </span>
            </Link>
        )}
      </nav>
  );
}
