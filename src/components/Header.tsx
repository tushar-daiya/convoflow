"use client";

import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  const pathname = usePathname();
  return (
    <div className="flex items-center">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" />
      <span className="capitalize">{pathname.slice(1)}</span>
    </div>
  );
}
