import React, { useEffect, useState } from "react"
import {Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
interface Customer {
    id: number;
    name: string;
    contact: string;
    address: string;
    imageUrl: string;
    folderId: string;
  }

const CustomerContact = ({name,contact,onChangeInput,setCustomerId,customerId,setName,setContact}:{
    name:string,
    contact:string,
    onChangeInput:(e:React.ChangeEvent<HTMLInputElement>) => void,
    setCustomerId:React.Dispatch<React.SetStateAction<number | undefined>>,
    customerId:number | undefined,
    setName:React.Dispatch<React.SetStateAction<string>>,
    setContact:React.Dispatch<React.SetStateAction<string>>
}) => {
    const [customers,setCustomers] = useState<Customer[]>();
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        if(!customers || customers.length === 0) return;
        const newfilteredCustomers = customers.filter(
          (customer) =>
            (customer.name.toLowerCase().includes(name.toLowerCase()) || customer.contact.toLowerCase().includes(contact.toLowerCase())),
        )
    
        setFilteredCustomers(newfilteredCustomers);
    },[customers,name,contact])

    useEffect(() => {
      if(!customerId || !customers) return;
      const currCustomer = customers.find((customer) => customer.id === customerId);
      if(currCustomer){
        setName(currCustomer.name);
        setContact(currCustomer.contact);
      }
    },[customerId])

    useEffect(() => {
        async function fetchData() {
          try {
            const res = await axios.get(`${BASE_URL}/api/v1/customer/all`, {
              headers: {
                authorization: `Bearer ` + localStorage.getItem('token')
              }
            })
            setCustomers(res.data.customers);
          }
          catch (error) {
            console.log(error);
          }
        }
        fetchData();
      },[])
  return (
    <div>
        <Popover onOpenChange={(open) => setIsPopoverOpen(open)}>
                    <PopoverTrigger asChild >
                      <Input type="text" id="contact" maxLength={10} value={contact} onChange={onChangeInput}
                        className="w-2/3 border-input min-w-[130px] w-full focus:border-blue-400 focus-visible:ring-blue-400 "/>
                    </PopoverTrigger>
                    <PopoverContent
                      className="h-40 w-20 z-50 p-0 border-border overflow-y-auto  scrollbar-hide"
                      style={{
                        pointerEvents: "auto",
                        touchAction: "auto",
                        WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                      }}
                    >
                      <div
                        className="p-1 dark:border-muted flex flex-col items-center scrollbar-hide overflow-x-hidden rounded-md border bg-popover dark:bg-gray-800 text-popover-foreground shadow-md"
                        onClick={() => setIsPopoverOpen(false)}
                      >
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className="w-full sm:text-sm text-xs cursor-pointer dark:hover:bg-card rounded-md justify-start p-1 px-4"
                            onClick={() => {
                              setCustomerId(customer.id);
                            }}
                          >
                            {customer.name}
                          </div>
                        ))} 
                      </div>
                    </PopoverContent>
              </Popover>
      
    </div>
  )
};

export default CustomerContact;
