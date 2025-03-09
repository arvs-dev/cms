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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ministries = [
  {
    title: "Communication & Children's Ministries",
    href: "/ministries/communication-children",
  },
  { title: "Education", href: "/ministries/education" },
  { title: "Family Ministries", href: "/ministries/family" },
  { title: "Health Ministries", href: "/ministries/health" },
  { title: "Ministerial", href: "/ministries/ministerial" },
  { title: "Publishing Ministries", href: "/ministries/publishing" },
  { title: "Sabbath", href: "/ministries/sabbath" },
  { title: "Women's Ministries", href: "/ministries/women" },
];

export function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="lg:hidden">
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-800 font-medium">
                Home
              </Link>
              <div>
                <p className="text-gray-800 font-medium">Directory</p>
                <ul className="pl-4 space-y-2">
                  {ministries.map((ministry) => (
                    <li key={ministry.href}>
                      <Link
                        href={ministry.href}
                        className="text-gray-600 hover:text-primary"
                      >
                        {ministry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/news-events" className="text-gray-800 font-medium">
                News & Events
              </Link>
              <Link href="/projects" className="text-gray-800 font-medium">
                Projects
              </Link>
              <Link href="/gallery" className="text-gray-800 font-medium">
                Gallery
              </Link>
              <Link href="/contact" className="text-gray-800 font-medium">
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" passHref>
                <NavigationMenuLink
                  className={cn(
                    "py-2 px-3 text-gray-800 font-medium",
                    pathname === "/" && "text-primary font-semibold"
                  )}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "py-2 px-3 text-gray-800 font-medium",
                  pathname.startsWith("/ministries") &&
                    "text-primary font-semibold"
                )}
              >
                Directory
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-1 p-2">
                  {ministries.map((ministry) => (
                    <li key={ministry.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={ministry.href}
                          className="block rounded-md p-2 text-sm hover:bg-primary hover:text-white"
                        >
                          {ministry.title}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/news-events" passHref>
                <NavigationMenuLink
                  className={cn(
                    "py-2 px-3 text-gray-800 font-medium",
                    pathname === "/news" && "text-primary font-semibold"
                  )}
                >
                  News & Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/gallery" passHref>
                <NavigationMenuLink
                  className={cn(
                    "py-2 px-3 text-gray-800 font-medium",
                    pathname === "/gallery" && "text-primary font-semibold"
                  )}
                >
                  Gallery
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" passHref>
                <NavigationMenuLink
                  className={cn(
                    "py-2 px-3 text-gray-800 font-medium",
                    pathname === "/contact" && "text-primary font-semibold"
                  )}
                >
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-700">
            <Search size={20} />
          </button>
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : null}
          <Link
            href="https://www.facebook.com/NLMAdventistMedia"
            target="_blank"
            className="bg-primary text-white py-5 px-5 lg:px-8 lg:py-8 text-xs lg:text-sm hover:bg-primary/90 transition"
          >
            Visit Us
          </Link>
        </div>
      </div>
    </header>
  );
}
