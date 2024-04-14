import { cn } from "@/lib/utils";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import Image from "next/image"; // Import the Image component

export default function Header() {
  return (
      <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
        <nav className="h-14 flex items-center justify-between px-4">
          <div className="hidden md:block">

              <a>
                  Alps Home
              </a>
          </div>
          <div className={cn("block sm:!hidden")}>
            <MobileSidebar />
          </div>
          <div className="flex items-center gap-2">
            <UserNav />
          </div>
        </nav>
      </div>
  );
}
