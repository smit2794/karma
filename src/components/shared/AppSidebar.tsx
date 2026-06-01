import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Utensils, 
  Package, 
  ShieldCheck, 
  HeartPulse, 
  FileText,
  UserCircle,
  Calendar,
  LogOut,
  ArrowLeftRight,
  UserPlus
} from "lucide-react";
import { useAppContext } from "@/store";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { role, setRole, setCurrentCoordinator } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();

  const adminMenu = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Children", url: "/admin/children", icon: Users },
    { title: "Programs", url: "/admin/programs", icon: Map },
    { title: "Food Distribution", url: "/admin/food", icon: Utensils },
    { title: "Inventory", url: "/admin/inventory", icon: Package },
    { title: "Coordinators", url: "/admin/coordinators", icon: ShieldCheck },
    { title: "Workers", url: "/admin/workers", icon: HeartPulse },
    { title: "Events", url: "/admin/events", icon: Calendar },
    { title: "Reports", url: "/admin/reports", icon: FileText },
  ];

  const coordinatorMenu = [
    { title: "Coordinator Dashboard", url: "/coordinator", icon: LayoutDashboard },
    { title: "Children", url: "/coordinator/children", icon: Users },
    { title: "Add Child", url: "/coordinator/add-child", icon: UserPlus },
    { title: "Programs", url: "/coordinator/programs", icon: Map },
    { title: "Food Distribution", url: "/coordinator/food", icon: Utensils },
    { title: "Inventory", url: "/coordinator/inventory", icon: Package },
    { title: "Workers", url: "/coordinator/workers", icon: HeartPulse },
    { title: "Profile", url: "/coordinator/profile", icon: UserCircle },
  ];

  const menu = role === "admin" ? adminMenu : coordinatorMenu;

  const handleExit = () => {
    setRole(null);
    setCurrentCoordinator(null);
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-none m-4 md:m-6 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] transition-all">
      <SidebarHeader className="flex h-20 items-center justify-between px-4 shrink-0 pt-4">
        {state === "expanded" && (
          <div className="flex items-center gap-2 overflow-hidden justify-center w-full">
            <img src="/logo.png" alt="Karma Foundation" className="h-12 w-auto object-contain transition-all" onError={(e) => {
              // Fallback if logo is not placed in public folder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shrink-0 text-xl shadow-md">
              K
            </div>
          </div>
        )}
        <SidebarTrigger className="hover:bg-slate-100" />
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto mt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {role === "admin" ? "Organization" : "Field Operations"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-4 mt-3 space-y-1">
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:font-medium data-[active=true]:shadow-md transition-all duration-300 rounded-2xl py-6 my-1"
                  >
                    <Link to={item.url} className="flex items-center gap-4 px-2">
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="text-[15px]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border shrink-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              {state === "expanded" && <span>Switch Role</span>}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exit Dashboard</DialogTitle>
              <DialogDescription>
                Are you sure you want to exit to the role selection screen?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleExit} className="bg-red-600 hover:bg-red-700">Exit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
