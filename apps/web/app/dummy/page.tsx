"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useRef } from "react";
import { User, UserPlus } from "lucide-react";

// Sample customer data - in a real app, this would come from an API or database
const initialCustomers = [
  { id: 1, name: "John Doe", contact: "+1 234-567-8901" },
  { id: 2, name: "Jane Smith", contact: "+1 234-567-8902" },
  { id: 3, name: "Robert Johnson", contact: "+1 234-567-8903" },
  { id: 4, name: "Emily Davis", contact: "+1 234-567-8904" },
  { id: 5, name: "Michael Brown", contact: "+1 234-567-8905" },
];

interface Customer {
  id: number;
  name: string;
  contact: string;
}

export default function Home({customers,input,setInput}:{
  customers:Customer[],
  input:string,
  setInput:React.Dispatch<React.SetStateAction<string>>
}) {
  const [isfocused,setIsFocused] = useState(false);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
        <h1 className="text-2xl font-bold text-foreground">Customer Search</h1>
      <div className="max-w-md mx-auto space-y-4 relative">
            <div className=" w-full">
              <Input
                placeholder="Search or add new customer..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full"
              />
            </div>
          { isfocused && input.length > 0 &&
            <div 
            className="w-[calc(100%-24px)] bg-muted ba p-0 absolute rounded-md scrollbar-hide top-7 left-0" 
          >
            {filteredCustomers.length > 0 && (
              <div className="max-h-[300px] overflow-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-start gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => {
                      setInput(customer.name);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.contact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          }

      </div>
    </div>
  );
}