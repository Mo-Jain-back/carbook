"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import PoylyEdge from "@/public/theme-svg/out-poly.svg";
import OutCircle from "@/public/theme-svg/outer-circle.svg";
import InnerCicle from "@/public/theme-svg/inner-circle.svg";
import { useState } from "react";

export default function page() {
  const [ theme, setTheme ] = useState("light")

  return (
      <div
          className={`flex flex-col p-1 ml-10 mt-10 w-20 h-20  cursor-pointer items-center justify-center relative`}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <PoylyEdge
            className={`w-full h-full stroke-0 fill-black dark:fill-white absolute top-0 left-0 transition-all duration-500 ${
              theme === "light" ? "scale-1 rotate-0" : "scale-0 rotate-180"
            }`}
          />
          <OutCircle
            className={`w-full h-full stroke-0 fill-black dark:fill-white absolute top-0 left-0 transition-all duration-500 ${
              theme === "light" ? "scale-[0.44]" : "scale-[0.66]"
            }`}
          />
          <InnerCicle
            className={`w-full h-full stroke-0 fill-black dark:fill-white absolute top-0 left-0 transition-all scale-[0.40] duration-500 ${
              theme === "light" ? "" : "translate-x-[11%] translate-y-[-9%]"
            }`}
          />
        </div>
  )
}
