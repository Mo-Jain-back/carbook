"use client"
import PoylyEdge from "@/public/theme-svg/out-poly.svg";
import OutCircle from "@/public/theme-svg/outer-circle.svg";
import InnerCicle from "@/public/theme-svg/inner-circle.svg";

export function ToggleButton({isToggled,setIsToggle}:
    {
        isToggled:boolean,
        setIsToggle:React.Dispatch<React.SetStateAction<boolean>>
    }) {

  return (
      <div
          className={`flex flex-col p-1 w-8 h-8  cursor-pointer items-center justify-center relative`}
          onClick={() => setIsToggle(!isToggled)}
        >
          <PoylyEdge
            className={`w-full h-full stroke-0 fill-yellow-400 dark:fill-white absolute top-0 left-0 transition-all duration-500 ${
              isToggled ? "scale-1 rotate-0" : "scale-0 rotate-180"
            }`}
          />
          <OutCircle
            className={`w-full h-full stroke-0 fill-yellow-400 dark:fill-white absolute top-0 left-0 transition-all duration-500 ${
              isToggled ? "scale-[0.44]" : "scale-[0.66]"
            }`}
          />
          <InnerCicle
            className={`w-full h-full stroke-0 fill-yellow-400 dark:fill-white absolute top-0 left-0 transition-all scale-[0.40] duration-500 ${
              isToggled ? "" : "translate-x-[11%] translate-y-[-9%]"
            }`}
          />
        </div>
  )
}
