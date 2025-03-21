"use client";

import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DisconnectGoogleDrive() {
  const router = useRouter();
  async function disconnect() {
    let loader;
    try {
      loader = toast.loading("Disconnecting Google Drive");
      const res = await axios.get("/api/disconnect/google", {
        withCredentials: true,
      });
      toast.dismiss(loader);
      toast.success("Google Drive Disconnected");
      router.refresh();
    } catch (error) {
      toast.error("Failed to disconnect Google Drive");
    }
  }
  return (
    <Button onClick={disconnect} variant={"destructive"}>
      Disonnect Google Drive
    </Button>
  );
}
