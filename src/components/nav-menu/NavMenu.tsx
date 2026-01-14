import {
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authoptions"
import { ThemeButton } from "./ThemeButton";
import { MobileMenu } from "./MobileMenu";
import { SIB } from './SIB'
import { SUB } from "./sub";
import { SOB } from "./sob";

export async function NavMenu() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex items-center justify-between w-full h-16 border-b border-border px-4 min-[640px]:px-6 lg:px-8">

      {/* Left group */}
      <div className="flex items-center space-x-6">
        <a href="/" className="text-xl min-[640px]:text-2xl font-semibold truncate">
          MDX Editor
        </a>

        {/* Desktop Navigation */}
        <div className="hidden min-[640px]:flex items-center space-x-4">
          <a href="/about" className={navigationMenuTriggerStyle()}>
            About
          </a>
          <a href="/public-repos" className={navigationMenuTriggerStyle()}>
            Public Repos...
          </a>
          {session && (
            <div className="hidden min-[710px]:block">
              <a href={`/u/${session.user.username}?m=1`} className={navigationMenuTriggerStyle()}>
                Your Repos...
              </a>
            </div>
          )}
          {session && (
            <div className="hidden min-[850px]:block">
              <a href={`/u/${session.user.username}`} className={navigationMenuTriggerStyle()}>
                Dashboard
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right group */}
      <div className="hidden min-[640px]:flex items-center space-x-3">
        <ThemeButton />
        {!session && <SUB />}
        {!session && <SIB />}
        {session && (
          <a href={`/u/${session.user.username}`} className="hover:underline">
            <b>{session.user.username}</b>
          </a>
        )}
        {session && <SOB />}
      </div>

      {/* Mobile */}
      <div className="flex min-[640px]:hidden items-center space-x-2">
        <ThemeButton />
        <MobileMenu session={session} />
      </div>
    </nav>
  )
}
