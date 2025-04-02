import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-4">
          <Header />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
