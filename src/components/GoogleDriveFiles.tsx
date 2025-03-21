"use client";
import { GoogleDriveFile } from "@/lib/type";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
export default function GoogleDriveFiles() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchFiles() {
    try {
      const res = await axios.get("/api/drive/files", {
        withCredentials: true,
      });
      const data = res.data;
      setFiles(data);
    } catch (error) {
      setError("Internal server error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="flex gap-5 flex-col">
          {files.map((file) => (
            <GoogleFileItem key={file.id} {...file} />
          ))}
        </div>
      )}
    </div>
  );
}

function GoogleFileItem(file: GoogleDriveFile) {
  const [loading, setLoading] = useState(false);
  async function handleClick() {
    try {
      setLoading(true);
      await axios.post(
        `/api/drive/upload/${file.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("File uploaded successfully");
    } catch (
      error: any // eslint-disable-line
    ) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error || "Internal server error";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="border border-gray-400 p-4 rounded-lg flex items-center justify-between w-full hover:shadow-2xl">
      <div>
        <h2 className="text-xl font-semibold">{file.name}</h2>
        <p className="text-gray-600">{file.mimeType}</p>
      </div>
      <Button onClick={handleClick}>
        {loading ? "Uploading..." : "Upload to Pinecone"}
      </Button>
    </div>
  );
}
