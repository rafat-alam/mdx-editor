import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { SignUpButton } from "./signup-button"
import { SignInButton } from "./signin-button"
import { ThemeButton } from "./theme-button"

export function NavMenu() {
  return (
    <div className="flex justify-between items-center w-full h-16 border-b border-border px-4">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-semibold">MDX Editor</Link>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/mdx-public">MDX Public</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        <ThemeButton />
        <SignUpButton />
        <SignInButton />
      </div>
    </div>
  )
}
