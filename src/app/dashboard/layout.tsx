import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
