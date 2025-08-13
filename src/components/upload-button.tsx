"use client";

import { useState } from "react";
import UploadDropzone from "@/components/upload-dropzone";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button className="flex gap-2">
          <Plus /> <p>Upload PDF</p>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="hidden">Upload pdf file</DialogTitle>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
