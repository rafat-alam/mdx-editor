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
import { SignOutButton } from "./signout-button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions"

export async function NavMenu() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex justify-between items-center w-full h-16 border-b border-border px-4">
      {/* eslint-disable @next/next/no-html-link-for-pages */}
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <a href="/" className="text-2xl font-semibold">MDX Editor</a>
        <a href="/about" className={navigationMenuTriggerStyle()}>About</a>
        <a href="/public-repos" className={navigationMenuTriggerStyle()}>Public Repos...</a>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        <ThemeButton />
        {!session && (<SignUpButton />)}
        {!session && (<SignInButton />)}
        {session && (<a href={`/u/${session.user.username}`}>
          <b>
            {session.user.username}
          </b>
        </a>)}
        {session && (<SignOutButton />)}
      </div>
      {/* eslint-enable @next/next/no-html-link-for-pages */}
    </div>
  )
}
