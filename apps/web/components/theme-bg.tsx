"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes";
import Fire from "@/public/sun-fire.svg";
import Circle from "@/public/sun-circle.svg";
import MoonStar from "@/public/moon-stars.svg";


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
                <div className="relative w-40 h-40 max-sm:w-28 max-sm:h-28">
                    <Fire className="absolute top-0 left-0 w-full h-full"/>
                    <Circle className= "absolute top-0 left-0 w-full h-full scale-[0.4]"/>
                </div>
            </div>
            <div className={` absolute overflow-hidden top-[-60%] dark:top-5 left-5 z-0 transition-all duration-500  pointer-events-none`}>
                <MoonStar className="w-40 h-40 max-sm:w-28 max-sm:h-28 dark:fill-white"/>
            </div>
        </div>
    )
};

export default ThemeBg;
