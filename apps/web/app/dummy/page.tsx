import { Button } from "@/components/ui/button";
import React from "react"

const page = () => {
  return (
    <div className="w-full h-full p-20 pt-32 flex items-center justify-center">
      <div className="w-full border-2 border-border rounded-lg relative">
        <div 
        style={{ width: '40%' }}
        className={`bg-blue-600 rounded-lg text-white h-[35px] transition-all duration-300 ease-in-out rounded-e-none hover:bg-opacity-80`}/>
        <div className={`w-full h-[35px] p-1 flex justify-center items-center absolute top-0 left-0 `}>
                <span>Please wait</span>
                <div className="flex items-end py-1 h-full">
                    <span className="sr-only">Loading...</span>
                    <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                </div>
          </div>
      </div>
    </div>
  )
};

export default page;
