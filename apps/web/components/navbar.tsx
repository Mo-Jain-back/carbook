import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <nav className="flex items-center justify-between sm:justify-between p-4 bg-primary text-primary-foreground">
      <Link href="/" className="text-2xl font-bold sm:flex-grow-0 flex-grow text-center sm:text-left">
        JCR
      </Link>
      <div className="space-x-2 hidden sm:block">
        <Button variant="secondary" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </nav>
  )
}

