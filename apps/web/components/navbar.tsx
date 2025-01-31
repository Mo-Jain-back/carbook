import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import logo from "../public/jcr logo design 2.png";

export function NavBar() {
  return (
    <nav className="flex items-center justify-center sm:justify-between px-4 py-[1px] bg-[#039BE5] text-primary-foreground">
      <Link href="/" className=" sm:flex-grow-0 flex-grow flex justify-center sm:justify-start">
        <Image
            src={logo}
            alt={"JCR"}
            style={{ objectFit: "cover" }}
            className="w-28 sm:rounded-l-lg sm:rounded-t-none"
          />
      </Link>
      <div className="space-x-2 hidden sm:block">

        <Button variant="secondary" className="bg-black hover:bg-blue-500 hover:border hover:border-black hover:text-black text-white" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </nav>
  )
}

