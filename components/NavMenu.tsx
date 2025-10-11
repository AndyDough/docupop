"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/uploadpage", label: "Upload" },
  { href: "/modelpage", label: "Model" },
  { href: "/reviewpage", label: "Review" },
  { href: "/datapage", label: "Data" },
];

export default function NavMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        variant="default"
      >
        Sign in
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList>
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Button onClick={() => signOut()} variant="default">
        Sign out
      </Button>
    </div>
  );
}
