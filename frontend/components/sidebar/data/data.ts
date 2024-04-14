
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
    title: "Contract1",
    href: "/contract",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Contract2",
    href: "/contract2",
    icon: "dashboard",
    label: "Dashboard",
  },




];
