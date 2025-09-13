import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SignUpButton() {
  return (
    <div className="flex flex-wrap items-center md:flex-row">
      <Link href="/login">
        <Button variant={"outline"}><b>SignUp</b></Button>
      </Link>
    </div>
  )
}
