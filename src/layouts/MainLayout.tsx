import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppContext } from "@/store";
import { Button } from "@/components/ui/button";

export default function MainLayout() {
  const { role, currentCoordinator } = useAppContext();
  
  if (!role) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          {/* Top Navbar */}
          <header className="h-16 mx-4 md:mx-6 lg:mx-8 mt-4 rounded-2xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-4 z-10 transition-all">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-primary/5 hover:text-primary transition-colors" />
              <h1 className="font-bold text-lg hidden sm:block tracking-tight text-slate-800 dark:text-slate-100">
                {role === "admin" ? "Admin Dashboard" : `${currentCoordinator?.name}'s Dashboard`}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Profile or other topbar actions can go here */}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pt-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
