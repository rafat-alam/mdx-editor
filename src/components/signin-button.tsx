import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SignInButton() {
  return (
    <div className="flex flex-wrap items-center md:flex-row">
      <Link href="/signin">
        <Button><b>SignIn</b></Button>
      </Link>
    </div>
  )
}
