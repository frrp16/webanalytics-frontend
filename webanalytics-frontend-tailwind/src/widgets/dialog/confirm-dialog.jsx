import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";

export function ConfirmDialog({ open, onClose, onConfirm, title, children }) {
  return (
    <Dialog size="sm" open={open} toggler={onClose} className="p-4">
      <DialogHeader toggler={onClose} className="justify-center">{title}</DialogHeader>
      <DialogBody>{children}</DialogBody>
      <DialogFooter className="flex flex-row gap-4 justify-center">
        <Button            
            onClick={onClose}
            ripple="light"
            color="red"
        >
            No
        </Button>
        <Button            
            onClick={onConfirm}
            ripple="light"            
        >
            Yes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}