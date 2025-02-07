"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes";
import MoonStar from "@/public/moon-stars.svg";
import SunSVG from "./SunSVG";

const ThemeBg = () => {
    const { theme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
  
    useEffect(() => {
      setMounted(true)
    }, [])
  
    if (!mounted) return null;
  
    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDarkMode = mounted && currentTheme === "dark";
  
    return (
        <div>
            <div className={` absolute dark:top-[100%] top-5 left-5 z-0 transition-all duration-500  pointer-events-none`}>
                <SunSVG className="w-40 h-40 max-sm:w-28 max-sm:h-28 fill-yellow-200"/>
            </div>
            <div className={` absolute overflow-hidden top-[-60%] dark:top-5 left-5 z-0 transition-all duration-500  pointer-events-none`}>
                <MoonStar className="w-40 h-40 max-sm:w-28 max-sm:h-28 dark:fill-white"/>
            </div>
        </div>
    )
};

export default ThemeBg;
