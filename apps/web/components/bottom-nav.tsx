import Link from "next/link"
import { Home, Calendar, User } from "lucide-react"

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#039BE5] text-primary-foreground sm:hidden">
      <div className="flex justify-around py-2">
        <Link href="/" className="flex flex-col items-center">
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/bookings" className="flex flex-col items-center">
          <Calendar className="h-6 w-6" />
          <span className="text-xs">Bookings</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center">
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}

