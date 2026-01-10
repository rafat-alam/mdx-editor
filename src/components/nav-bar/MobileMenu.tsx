'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { SignOutButton } from './signout-button'
import { SignInButton } from './signin-button'
import { SignUpButton } from './signup-button'

interface MobileMenuProps {
  session: any
}

export function MobileMenu({ session }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-6">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <a
              href="/about"
              onClick={handleLinkClick}
              className={`${navigationMenuTriggerStyle()} justify-start w-full`}
            >
              About
            </a>
            <a
              href="/public-repos"
              onClick={handleLinkClick}
              className={`${navigationMenuTriggerStyle()} justify-start w-full`}
            >
              Public Repos...
            </a>
          </div>

          <Separator />

          {/* User Section */}
          {session && (
            <div className="flex flex-col space-y-3">
              <a
                href={`/u/${session.user.username}`}
                onClick={handleLinkClick}
                className="px-4 py-2 text-sm font-bold hover:bg-accent rounded-md transition-colors"
              >
                {session.user.username}
              </a>
              <SignOutButton />
            </div>
          )}

          {/* Auth Buttons for non-logged in users */}
          {!session && (
            <div className="flex flex-col space-y-2">
              <SignInButton />
              <SignUpButton />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
