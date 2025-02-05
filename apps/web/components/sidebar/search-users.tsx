import { HiOutlineUsers } from "react-icons/hi";
import { Input } from "../ui/input";
import { CarFrontIcon } from "lucide-react";

export default function SearchUsers() {
  return (
    <div className="relative ">
      <CarFrontIcon className="absolute left-2.5 top-3 h-4 w-4 text-slate-600 dark:text-slate-300" />
      <Input
        type="search"
        placeholder="Search for Cars"
        className="w-full rounded-lg pl-7 bg-slate-100 dark:bg-muted dark:placeholder:text-slate-300 dark:text-slate-300 placeholder:text-slate-600 border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
      />
    </div>
  )
}
