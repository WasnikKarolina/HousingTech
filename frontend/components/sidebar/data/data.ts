
import { NavItem } from "../types";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};


export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Buy now",
    href: "/dashboard/buy",
    icon: "categories",
    label: "buy",
  },
  {
    title: "Coming Soon",
    href: "/dashboard/coming",
    icon: "space",
    label: "spaces",
  },
  {
    title: "Sold items",
    href: "/dashboard/sold",
    icon: "container",
    label: "containers",
  },
  {
    title: "All live Auctions",
    href: "/dashboard/overview",
    icon: "item",
    label: "items",
  },


];
