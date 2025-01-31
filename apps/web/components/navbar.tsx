import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from "../public/jcr1.png";

export function NavBar() {
  return (
    <nav className="flex items-center justify-center sm:justify-between px-4 py-2 bg-[#039BE5] text-primary-foreground">
      <Link href="/" className=" sm:flex-grow-0 flex-grow flex justify-center sm:justify-start">
        <Image
            src={logo}
            alt={"JCR"}
            style={{ objectFit: "cover" }}
            className="w-12 sm:w-20 sm:rounded-l-lg sm:rounded-t-none"
          />
      </Link>
      <div className="space-x-2 hidden sm:block">
        <Button variant="secondary" className="bg-blue-100 text-secondary-foreground" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
        <Button variant="secondary" className="bg-blue-100" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </nav>
  )
}

