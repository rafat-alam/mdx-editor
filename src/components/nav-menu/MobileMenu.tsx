'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { SIB } from './SIB'
import { SUB } from './sub'
import { SOB } from './sob'

interface MobileMenuProps {
  session: any
}

export function MobileMenu({ session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMenu}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-12 w-[280px] bg-background border border-border rounded-lg shadow-lg z-50 p-4">
            <div className="flex flex-col space-y-4">
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

              {/* Separator */}
              <div className="border-t border-border" />

              {/* User Section */}
              {session && (
                <div className="flex flex-col space-y-3">
                  <a
                    href={`/u/${session.user.username}`}
                    onClick={handleLinkClick}
                    className="px-4 py-2 text-sm font-bold hover:bg-accent rounded-md transition-colors"
                  >
                    Dashboard - {session.user.username}
                  </a>
                  <SOB />
                </div>
              )}

              {/* Auth Buttons for non-logged in users */}
              {!session && (
                <div className="flex flex-col space-y-2">
                  <SIB />
                  <SUB />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
