"use client";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";

// Sample customer data - in a real app, this would come from an API or database
const customers = [
  { id: 1, name: "John Doe", contact: "+1 234-567-8901" },
  { id: 2, name: "Jane Smith", contact: "+1 234-567-8902" },
  { id: 3, name: "Robert Johnson", contact: "+1 234-567-8903" },
  { id: 4, name: "Emily Davis", contact: "+1 234-567-8904" },
  { id: 5, name: "Michael Brown", contact: "+1 234-567-8905" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Customer Search</h1>
        
        <div className="relative" ref={inputRef}>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div>
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                  }}
                  className="w-full"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[calc(100%-24px)] p-0" 
              align="start"
              sideOffset={5}
            >
              {filteredCustomers.length > 0 ? (
                <div className="max-h-[300px] overflow-auto">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-start gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => {
                        setSearch(customer.name);
                        setIsOpen(false);
                      }}
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
              ) : (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No customers found
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}