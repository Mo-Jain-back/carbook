import React, { useEffect, useState } from "react"
import {Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { User } from "lucide-react";
interface Customer {
    id: number;
    name: string;
    contact: string;
    address: string;
    imageUrl: string;
    folderId: string;
  }

const CustomerName = ({name,contact,onChangeInput,setCustomerId,setName,setContact,customers}:{
    name:string,
    contact:string,
    onChangeInput:(e:React.ChangeEvent<HTMLInputElement>) => void,
    setCustomerId:React.Dispatch<React.SetStateAction<number | undefined>>,
    customerId:number | undefined,
    setName:React.Dispatch<React.SetStateAction<string>>,
    setContact:React.Dispatch<React.SetStateAction<string>>
    customers:Customer[] | undefined
}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        if(!customers || customers.length === 0) return;
        const newfilteredCustomers = customers.filter(
          (customer) =>
            (customer.name.toLowerCase().includes(name.toLowerCase())),
        )
    
        setFilteredCustomers(newfilteredCustomers);
    },[customers,name,contact])

    
    
  return (
    <div className="relative">
        <div className=" w-full relative">
              <Input
                placeholder="Search or add new customer..."
                value={name}
                onChange={onChangeInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full"
              />
            </div>
          { isFocused && name.length > 0 &&
            <div 
            className="w-full bg-muted ba p-0 absolute rounded-md scrollbar-hide top-10 left-0" 
          >
            {filteredCustomers.length > 0 && (
              <div className="max-h-[300px] overflow-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-start gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => {
                      setCustomerId(customer.id);
                      setName(customer.name);
                      setContact(customer.contact);
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
  )
};

export default CustomerName;
