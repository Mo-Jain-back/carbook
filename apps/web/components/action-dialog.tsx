import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";


const ActionDialog = ({isDialogOpen,setIsDialogOpen,action,handleAction}:
    {
        isDialogOpen:boolean,
        setIsDialogOpen:React.Dispatch<React.SetStateAction<boolean>>,
        action:string,
        handleAction:() => void
    }) => {
  return (
    <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-muted border-border">
            <DialogHeader>
              <DialogTitle>{action}</DialogTitle>
              <DialogDescription className="text-grey-500">
                "Are you sure you want to {action} the booking?" 
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
      
    </div>
  )
};

export default ActionDialog;
