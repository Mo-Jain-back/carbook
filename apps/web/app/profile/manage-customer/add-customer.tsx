"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Loader2, LocateIcon, Upload, X } from "lucide-react"
import CarFrontIcon from "@/public/car-front.svg";
import { BASE_URL } from "@/lib/config";
import axios from "axios"
import { uploadMultipleToDrive, uploadToDrive } from "@/app/actions/upload";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"
import { BsFilePdfFill } from "react-icons/bs"
import { Textarea } from "@/components/ui/textarea";
import LoactionIcon from "@/public/location.svg";

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

interface AddCarDialogProps {
  isOpen:boolean;
  setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
  setCustomers:React.Dispatch<React.SetStateAction<Customer[]>>;
}

interface FormErrors {
  [key: string]: string;
}


export function AddCustomer({isOpen,setIsOpen,setCustomers}:AddCarDialogProps) {
    
  const [name,setName] = useState<string>("");
  const [contact,setContact] = useState<string>("");
  const [address,setAddress] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name) newErrors.name = "This field is mandatory";
    if (!contact) newErrors.contact = "This field is mandatory";
    if (!address) newErrors.address = "This field is mandatory";
    if (!documents) newErrors.documents = "No Files uploaded";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast({
        title: `Error`,
        description: `Please fill all mandatory fields`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
      return;
    }
    if(!documents) return;

    setIsLoading(true);
    try {
        const resDoc = await uploadMultipleToDrive(documents,"name",name);

        if(resDoc.error || !resDoc.uploadedFiles){
            toast({
              title: `Error`,
              description: `Failed to upload aadhar card and driving license`,
              className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
              variant: "destructive",
            });
            throw new Error("Failed to upload aadhar card and driving license");
          }
        
        const res = await axios.post(`${BASE_URL}/api/v1/customer`,{
          name,
          contact,
          address,
          folderId:resDoc.uploadedFiles[0].folderId,
          documents:resDoc.uploadedFiles
        },{
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem('token')
            }
          })
        const documentsObj = resDoc.uploadedFiles;
       
        const customer = {
          id: res.data.customerId,
          name,
          contact,
          address,
          folderId:documentsObj[0].folderId || "",
          documents:documentsObj.map(file => {
            return {
              name:file.name|| "",
              url:file.url || "",
              type:file.type || "",
            }
          })
        };
        setCustomers(prev => [...prev,customer]);
        setName("");
        setContact("");
        setAddress("");
        setDocuments([]);
        toast({
          title: `Car added`,
          description: `Car Successfully added`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        });
      }
      catch (error) {
        console.log(error);
        toast({
          title: `Error`,
          description: `Failed to submit form`,
          className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
        });
        setIsLoading(false);
      }
  }
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
      if (files) {
          if(files.length > 5){
            setErrors(prev => ({ ...prev, ["documents"]: "You can upload upto 5 documents or images" }));
            setDocuments([]);
            return;
          }
        for (const file of files) {
          if(file.size > 1024*1024*6){
            setErrors(prev => ({ ...prev, ["documents"]: "File size should be less than 6MB" }));
            return;
          }
            if(!file.type.startsWith("image/") && !file.type.includes("pdf")){
              setErrors(prev => ({ ...prev, ["documents"]: "Please upload only image or pdf files" }));
              setDocuments([]);

              return;
            }
          else{
            if(!file.type.startsWith("image/")){
              setErrors(prev => ({ ...prev, ["documents"]: "Please upload only image" }));
              setDocuments([]);

              return;
            }
          } 
        }
        setDocuments([...Array.from(files)])
        setErrors(prev => ({ ...prev, ["documents"]: "" }));
      }
  }


  const inputClassName = (fieldName: string) => cn(
    "w-full text-sm",
    errors[fieldName] && "border-red-500 focus:border-red-500"
  );
  const handleRemoveFile = ( index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (type: string) => {
    if(!type.startsWith('image/')){
      return <BsFilePdfFill className="sm:w-4 sm:h-4 w-3 h-3" />
    }
    return <ImageIcon className="sm:w-4 sm:h-4 w-3 h-3" />
  }

  const renderFileList = () => (
    <div className="mt-2 text-sm">
      {documents.map((file, index) => (
        <div
          key={index}
          className="flex w-fit sm:max-w-[200px] sm:max-h-[40px] max-w-[150px] max-h-[30px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
        >
          <span className="sm:min-w-4 min-w-3">
            {getFileIcon(file.type)}
          </span>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">{file.name}</span>
          <span
            className="rotate-45 text-red-500 w-3 cursor-pointer text-[25px]"
            onClick={() => handleRemoveFile( index)}
          >
            +
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-auto overflow-y-auto dark:border-gray-800 ">
            <form onSubmit={handleSubmit} className="space-y-4">
                <DialogHeader>
                    <DialogTitle>
                        <div></div>
                    </DialogTitle>
                </DialogHeader>
                <div className="text-[50px] font-bold">
                    <Input
                    type="text"
                    name="title"
                    value={name} 
                    onChange={(e) =>{
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, carBrand: "" }));
                    }}
                    placeholder="Add Customer Name"
                    className="my-4 rounded-none placeholder:text-[30px] text-[30px] max-sm:placeholder:text-[24px]  md:text-[30px] file:text-[30px] placeholder:text-gray-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div className="gap-4 w-10/11">
                            <div className="flex justify-between gap-1 items-center">
                                <CarFrontIcon className="w-16 h-4 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" /> 
                                <div className="w-full">
                                    <Input
                                        type="text"
                                        name="title"
                                        placeholder="Add contact number"
                                        value={contact} 
                                        onChange={(e) => {
                                            setContact(e.target.value);
                                            setErrors(prev => ({ ...prev, contact: "" }));
                                        }}
                                        className="my-4 w-full rounded-none placeholder:text-[14px] max-sm:placeholder:text-[12px] max-sm:text-[12px] text-[14px] md:text-[14px] placeholder:text-gray-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                                </div>      
                            </div>
                            <div className="flex justify-between gap-1 items-center">
                                <LoactionIcon className="w-16 h-4 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" />
                                <div className="w-full">
                                    <Label className="max-sm:text-xs" htmlFor="documents">Address<span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="address" 
                                        value={address} 
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                            setErrors(prev => ({ ...prev, address: "" }));
                                        }}
                                        className={inputClassName("address")}
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>
                            </div>
                </div>

                <div className="flex items-center gap-2 w-full">
                    <div>
                        <Label className="max-sm:text-xs" htmlFor="documents">Driving License and Aadhar Card <span className="text-red-500">*</span></Label>
                        <div onClick={() => {
                            document.getElementById('documents')?.click()
                            }} className="flex items-center justify-center  bg-gray-300 max-sm:text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors">
                            <Upload className="mr-2 h-4 w-4" />
                            <span>Choose file</span>
                        </div>
                        <Input
                        id="documents"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e)}
                        className={"hidden"}
                        />
                        {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents}</p>}
                        
                    </div>
                    <div className="flex justify-center items-center w-[210px] h-[220px] max-sm:min-w-[155px] min-h-[170px] border border-border px-[2px] sm:p-1">
                        
                        {(renderFileList() )}
                        {documents.length === 0 &&(
                            <span className="text-center text-sm text-gray-400 dark:text-gray-500">
                                Upload upto 5 documents or images
                            </span>
                        )}

                    </div>
                </div>
                <div>
                <Button type="submit" className={`bg-blue-600 dark:text-white hover:bg-opacity-80 w-full ${isLoading && "cursor-not-allowed opacity-50"}`}>
                    {isLoading ?
                      <>
                      <span>Please wait</span>
                      <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 dark:bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1 w-1 dark:bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1 w-1 dark:bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                      </div>
                      </>
                    :
                    <span>Create</span>
                    }
                </Button>
                </div>
            </form>
        </DialogContent>
        </Dialog>
    </>
  )
}