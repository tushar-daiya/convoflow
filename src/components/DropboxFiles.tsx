"use client";
import { DropboxFile } from "@/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function DropboxFiles() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<DropboxFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchFiles() {
    try {
      const res = await axios.get("/api/dropbox/files", {
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
            <DropBoxFileItem key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}

function DropBoxFileItem({ file }: { file: DropboxFile }) {
  const [loading, setLoading] = useState(false);
  async function handleClick() {
    try {
      setLoading(true);
      await axios.post("/api/dropbox/upload", {
        path: file.path_lower,
      });
      toast.success("File uploaded successfully");
    } catch (
      error: any // eslint-disable-line
    ) {
      console.log(error?.response);
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
      </div>
      <Button onClick={handleClick}>
        {loading ? "Uploading..." : "Upload to Pinecone"}
      </Button>
    </div>
  );
}
