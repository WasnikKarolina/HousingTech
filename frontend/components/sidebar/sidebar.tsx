import { DashboardNav } from "./dashboard-nav";
import { navItems } from "./data/data";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  return (
      <nav className={cn(`relative hidden h-screen border-r pt-16 md:block w-72`)}>
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="space-y-1">
                <DashboardNav items={navItems} />
              </div>
            </div>
          </div>
          <div className="px-3 py-2 text-xs text-gray-500">&copy; Alps Auction 2024</div>
        </div>
      </nav>
  );
}
