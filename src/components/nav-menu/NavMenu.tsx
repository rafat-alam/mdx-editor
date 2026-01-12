import {
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions"
import { ThemeButton } from "./ThemeButton";
import { SignUpButton } from "./SignUpButton";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { MobileMenu } from "./MobileMenu";

export async function NavMenu() {
  const session = await getServerSession(authOptions);
  
  return (
    <nav className="flex justify-between items-center w-full h-16 border-b border-border px-4 md:px-6 lg:px-8">
      {/* eslint-disable @next/next/no-html-link-for-pages */}
      
      {/* Logo/Brand - Always visible */}
      <div className="flex items-center">
        <a href="/" className="text-xl md:text-2xl font-semibold truncate">
          MDX Editor
        </a>
      </div>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-4">
        <a href="/about" className={navigationMenuTriggerStyle()}>
          About
        </a>
        <a href="/public-repos" className={navigationMenuTriggerStyle()}>
          Public Repos...
        </a>
      </div>

      {/* Desktop Auth Section - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-3">
        <ThemeButton />
        {!session && (<SignUpButton />)}
        {!session && (<SignInButton />)}
        {session && (
          <a href={`/u/${session.user.username}`} className="hover:underline">
            <b>{session.user.username}</b>
          </a>
        )}
        {session && (<SignOutButton />)}
      </div>

      {/* Mobile Menu - Visible only on mobile */}
      <div className="flex md:hidden items-center space-x-2">
        <ThemeButton />
        <MobileMenu session={session} />
      </div>

      {/* eslint-enable @next/next/no-html-link-for-pages */}
    </nav>
  )
}
