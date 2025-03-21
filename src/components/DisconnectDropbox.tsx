"use client";

import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DisconnectDropbox() {
  const router = useRouter();
  async function disconnect() {
    let loader;
    try {
      loader = toast.loading("Disconnecting Dropbox");
      const res = await axios.get("/api/disconnect/dropbox", {
        withCredentials: true,
      });
      toast.dismiss(loader);
      toast.success("Dropbox Disconnected");
      router.refresh();
    } catch (error) {
      toast.error("Failed to disconnect Dropbox");
    }
  }
  return (
    <Button onClick={disconnect} variant={"destructive"}>
      Disonnect Dropbox
    </Button>
  );
}
