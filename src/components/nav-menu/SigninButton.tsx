"use client"

import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <div className="flex flex-wrap items-center md:flex-row">
      <a href="/signin">
        <Button>
          <b>SignIn</b>
        </Button>
      </a>
    </div>
  );
}