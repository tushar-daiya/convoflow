"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      return;
    }
    console.log(files)
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files[]", file);
    });
    let loadingToast = toast.loading("Uploading files...");
    try {
      const res = await axios.post("/api/upload", formData, {
        withCredentials: true,
      });
      console.log(res.data);
      toast.dismiss(loadingToast);
      toast.success("Files uploaded successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to upload files");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <div className="min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>
      {files.length > 0 && <Button onClick={handleUpload} className="mt-5">Upload to Pinecone</Button>}
    </div>
  );
}
