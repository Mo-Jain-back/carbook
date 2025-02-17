"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X, Edit2, Trash2, User, Phone, ImageIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import UserIcon from "@/public/user.svg"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import { toast } from "@/hooks/use-toast"
import LoactionIcon from "@/public/location.svg";
import { Textarea } from "@/components/ui/textarea"
import { BsFilePdfFill } from "react-icons/bs"
import { uploadMultipleToDrive } from "@/app/actions/upload"


enum Status {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
  inProgress = "inProgress",
  completed = "completed",
}
export const BookingStatusIcon  = ({ status,className }: { status?: Status; className?: string }) => {
  const statusIcons = {
    pending: <Clock className={`text-yellow-500 ${className}`} />,
    confirmed: <CheckCircle className={`text-green-500 ${className}`} />,
    cancelled: <XCircle className={`text-red-500 ${className}`} />,
    inProgress: <Loader2 className={`text-blue-500 animate-spin ${className}`} />,
    completed: <CheckCircle className={`text-green-500 ${className}`} />,
  };

  return status ? statusIcons[status] : <Clock className={`text-gray-500 ${className}`} />;
};

interface Customer {
    id: number;
    name:string;
    contact:string;
    address?:string;
    documents? : Document[];
    folderId?:string;
  }

  interface Document {
    name:string;
    url:string;
    type:string;
  }
interface EventSummaryPopupProps {
  customer: Customer;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomers:React.Dispatch<React.SetStateAction<Customer[]>>;
}

export function CustomerPopup({ customer, isOpen, setIsOpen,setCustomers }: EventSummaryPopupProps) {
  
  const [action,setAction] = useState<"Delete" | "Update" | "delete the documents of">("Delete");
  const [address,setAddress] = useState(customer.address);
  const [documents,setDocuments] = useState<Document[] | undefined>(customer.documents);
  const [name,setName] = useState<string>(customer.name);
  const [contact,setContact] = useState<string>(customer.contact);
  const [isEditing, setIsEditing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  function handleAction() {
   if(action === "Delete"){
      handleDelete();
    }
    else if(action === "Update"){
      handleUpdate();
    }
    else if(action === "delete the documents of"){
      handleDocumentDelete();
    }
    return;
  }

  useEffect(() => {
    if(!isOpen) setIsEditing(false);
  },[isOpen])


  const handleDelete = async() => {
    try{
      await axios.delete(`${BASE_URL}/api/v1/customer/${customer.id}`,{
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem('token')
        }
      });

      setCustomers(prev => prev.filter((c) => c.id !== customer.id))
      toast({
        title: `Booking deleted`,
        description: `Event Successfully deleted`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      setIsOpen(false);
    }
    catch(error){
      console.log(error);
      toast({
        title: `Error`,
        description: `Booking failed to delete`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
    }
  }

  const handleEdit = () => {
    setAction("Update");
    setIsEditing(!isEditing)
  }

  const handleDocumentDelete = async() => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/booking/${customer.id}/documents/all`, {
        headers: {
          authorization: `Bearer ` + localStorage.getItem('token')
        }
      });
      setDocuments([]);
      toast({
        title: `Document deleted`,
        description: `Document Successfully deleted`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });

    } catch(error) {
      toast({
        title: `Error`,
        description: `Failed to delete document`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
      console.log(error);
    }
  }

  const handleUpdate = async () => {
    try{
        let resDoc;
        if(!documents){
            if(customer.folderId && customer.folderId !== ""){
                resDoc = await uploadMultipleToDrive(uploadedFiles,"id",customer.folderId);
            }
            else{
                resDoc = await uploadMultipleToDrive(uploadedFiles,"name",name);
            }
        }
        
        const folderId = resDoc && resDoc.uploadedFiles ? resDoc.uploadedFiles[0].folderId : customer.folderId;
        const updatedDocuments = resDoc && resDoc.uploadedFiles ? resDoc.uploadedFiles : customer.documents;
        
        await axios.put(`${BASE_URL}/api/v1/customer/${customer.id}`,{
            name:name,
            contact:contact,
            address:address,
            folderId,
            updatedDocuments
        },{
            headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem('token')
            }
        });

      const upadtedCustomer = {
        id: customer.id,
        name,
        contact,
        address,
        folderId:folderId,
        documents:updatedDocuments && updatedDocuments.map(file => {
          return {
            name:file.name|| "",
            url:file.url || "",
            type:file.type || ""
          }
        })
      };
      setCustomers(prev => [...prev,upadtedCustomer]);
      setIsEditing(false)
      toast({
        title: `Booking updated`,
        description: `Event Successfully updated`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    }
    catch(error){
      console.log(error);
      toast({
        title: `Error`,
        description: `Booking failed to update`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
    }
    
  }


  const getFileIcon = (type: string) => {
    if(!type.startsWith('image/')){
      return <BsFilePdfFill className="sm:w-4 sm:h-4 w-3 h-3" />
    }
    return <ImageIcon className="sm:w-4 sm:h-4 w-3 h-3" />
  }

  const renderFileList = () => (
    <div className="mt-2 text-sm">
      {documents ?
      documents.map((file, index) => (
        <div
          key={index}
          className="flex w-fit max-w-[150px] max-h-[25px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
        >
          <span className="sm:min-w-4 min-w-3">
            {getFileIcon(file.type)}
          </span>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">{file.name}</span>
        </div>
      ))
      :
      uploadedFiles.map((file, index) => (
        <div
          key={index}
          className="flex w-fit max-w-[150px] max-h-[25px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
        >
          <span className="sm:min-w-4 min-w-3">
            {getFileIcon(file.type)}
          </span>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">{file.name}</span>
        </div>
      ))
      }
    </div>
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
      if (files) {
          if(files.length > 5){
            setUploadedFiles([]);
            toast({
              title: `Error`,
              description: `You can upload upto 5 documents or images`,
              className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
              variant: "destructive",
            });
            return;
          }
          console.log("files",files);
        setUploadedFiles([...Array.from(files)])
      }
  }

  const heading = action.split(" ")[0];
  const upperHeading = heading.charAt(0).toUpperCase() + heading.slice(1);

  if(!customer) return;

  return (
    <>
    {isOpen && 
    <div className="fixed top-0 left-0 h-screen w-screen z-10 bg-black/50 backdrop-blur-sm"></div>}
    <Dialog open={isOpen}  onOpenChange={setIsOpen} modal={false} >
      
      <DialogContent className="sm:max-w-[425px] z-20 border-border max-sm:min-h-[70%] flex flex-col p-0 items-center overflow-auto">
        <DialogHeader className="flex flex-row justify-between items-center w-full px-6 py-0">
          <DialogTitle >
            <div className="flex justify-start w-full whitespace-nowrap mt-2">Customer Id: {customer.id}</div>
          </DialogTitle>
          <div className="flex justify-end w-full items-center w-full mr-4 mb-2">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              setAction("Delete");  
              setIsDialogOpen(true);
            }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        </DialogHeader>

        <div className="px-6 pb-2 h-full w-full max-sm:mt-6">
        
          <div className=" space-y-4 w-[90%]">
            <div className="flex items-center space-x-2">
              
              <UserIcon className="h-6 w-6 mt-1 mr-3 stroke-[12px] fill-black dark:fill-white stroke-black dark:stroke-white" />
              <div>
                {isEditing ? (
                  <Input
                    name="bookedBy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-muted text-sm"
                  />
                ) : (
                  <p className="text-sm font-semibold">{name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
                <Phone className="h-6 w-6 mr-3 text-black dark:text-white"/>
                <div>
                {isEditing ? (
                  <Input
                    name="bookedBy"
                    value={contact}
                    maxLength={10}
                    onChange={(e) => setContact(e.target.value)}
                    className="bg-muted text-sm"
                  />
                ) : (
                  <p className="text-sm font-semibold">{contact}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
                <LoactionIcon className="w-6 h-6 mr-3 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" />
                {isEditing ? (
                    <Textarea
                    id="address" 
                    value={address || ""} 
                    onChange={(e) => {
                        setAddress(e.target.value);
                    }}
                    className="w-full bg-muted text-sm"
                    />
                     )
                    :
                    <p className="text-sm font-semibold">{address ? address : "No Address Added"}</p>
                }
            </div>
            <div >
                  <div className="flex w-full gap-2 justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-1">
                            <span>Documents</span>
                            {isEditing && <Button className="cursor-pointer bg-gray-200 dark:bg-muted dark:text-white text-black hover:bg-gray-300 dark:hover:bg-secondary hover:bg-opacity-30" onClick={() => {
                                setAction("delete the documents of");
                                setIsDialogOpen(true);
                            }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>}
                        </div>
                        {isEditing && 
                            <div onClick={() => {
                                document.getElementById('documents')?.click()
                                }} className="flex items-center justify-center  bg-gray-300 max-sm:text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors">
                                <Upload className="mr-2 h-4 w-4" />
                                <span>Choose file</span>
                            </div>}

                        <Input
                            id="documents"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileUpload(e)}
                            className={"hidden"}
                            />
                    </div>
                    <div className="flex w-full justify-center items-center w-[155px] h-[170px] border border-border px-[2px] sm:p-1">
                        {(renderFileList() )}
                        {documents && documents.length === 0 &&(
                            <span className="text-center text-sm text-gray-400 dark:text-gray-500">
                                Upload upto 5 documents or images
                            </span>
                        )}
                    </div>
                </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4">
              <Button onClick={() => {
                setAction("Update");
                setIsDialogOpen(true);
              }} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-muted border-border">
            <DialogHeader>
              <DialogTitle>{upperHeading}</DialogTitle>
              <DialogDescription className="text-grey-500">
                "Are you sure you want to {action} the customer?" 
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button className="max-sm:w-full bg-primary hover:bg-opacity-10 shadow-lg" onClick={() => {
                handleAction();
                setIsDialogOpen(false)
              }}>{action}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  )
}
