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
    <header className="bg-primary shadow-sm w-full">
      <div className="flex flex-row-reverse justify-between px-52">
        {/* Actions */}
        <div className="flex items-center ">
          <Link
            href="https://www.facebook.com/NLMAdventistMedia"
            target="_blank"
            className="bg-white text-primary px-10 py-10 font-medium hover:bg-white/90 transition"
          >
            Visit Info
          </Link>
        </div>
      </div>
    </header>
  );
}
