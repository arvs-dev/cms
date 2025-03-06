"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

export function Footer() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="bg-stone-800 shadow-sm w-full">
      <div className="container flex flex-row justify-between px-6 lg:px-12">
        {/* Actions */}
        <div className="flex items-center text-white">
          <h1 className="lg:text-xl text-medium font-medium">
            NORTHERN LUZON MISSION of the Seventh-day Adventist
          </h1>
        </div>
        <div className="flex items-center ">
          <Link
            href="https://www.facebook.com/NLMAdventistMedia"
            target="_blank"
            className="bg-primary text-white px-10 py-10 font-medium hover:bg-primary/90 transition"
          >
            Visit Info
          </Link>
        </div>
      </div>
    </header>
  );
}
