"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Search, UserPlus, Pencil, Trash2, Phone, User, View } from "lucide-react";
import { AddCustomer } from "./add-customer";
import { CustomerPopup } from "./view-customer";
import axios from "axios";
import { BASE_URL } from "@/lib/config";

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
    name:string;
    contact:string;
    address?:string;
    folderId?:string;
    documents? : Document[];
}

interface Document {
    name:string;
    url:string;
    type:string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isAddCustomerOpen,setIsAddCustomerOpen] = useState(false);
  const [isViewCustomerOpen,setIsViewCustomerOpen] = useState(false);
  const [selectedCustomer,setSelectedCustomer] = useState<Customer>();

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

  useEffect(() => {
    console.log("customers",customers);
  },[customers])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
        <AddCustomer isOpen={isAddCustomerOpen} setIsOpen={setIsAddCustomerOpen} setCustomers={setCustomers} />
        {selectedCustomer &&
            <CustomerPopup customer={selectedCustomer} isOpen={isViewCustomerOpen} setIsOpen={setIsViewCustomerOpen} setCustomers={setCustomers} />
        }
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <Button className="flex items-center gap-2"
                onClick={() => setIsAddCustomerOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Add Customer
              </Button>
        </div>

        <Card className="border-border bg-muted">
          <CardContent className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="rounded-md border border-border">
              <Table className="border-border">
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-border">
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}
                    onClick = {() => {
                        setSelectedCustomer(customer)
                        setIsViewCustomerOpen(true);
                    }}
                     className="border-border cursor-pointer ">
                      <TableCell className="font-medium border-border">
                        {customer.name}
                      </TableCell>
                      <TableCell className="border-border">{customer.contact}</TableCell>
                      <TableCell>
                        
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}