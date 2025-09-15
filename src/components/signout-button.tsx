'use client'
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react";
import { useState } from "react";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex flex-wrap items-center md:flex-row">
      <Button 
        onClick={handleLogout}
        disabled={loading}
        variant={"outline"}>
          <b>{loading ? 'Signing out...' : 'Signout'}</b>
      </Button>
    </div>
  )
}
