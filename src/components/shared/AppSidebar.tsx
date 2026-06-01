import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Map, Utensils, Package,
  ShieldCheck, HeartPulse, FileText, UserCircle,
  Calendar, LogOut, ArrowLeftRight, UserPlus,
  PieChart, ChevronRight
} from "lucide-react";
import { useAppContext } from "@/store";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarTrigger, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/* ── Menu definitions ────────────────────────────────── */
const adminMenu = [
  { title: "Dashboard",        url: "/admin",              icon: LayoutDashboard, accent: "#5DBCEB" },
  { title: "Children",         url: "/admin/children",     icon: Users,           accent: "#F28C28" },
  { title: "Programs",         url: "/admin/programs",     icon: Map,             accent: "#5DBCEB" },
  { title: "Food Distribution",url: "/admin/food",         icon: Utensils,        accent: "#F28C28" },
  { title: "Inventory",        url: "/admin/inventory",    icon: Package,         accent: "#5DBCEB" },
  { title: "Coordinators",     url: "/admin/coordinators", icon: ShieldCheck,     accent: "#F28C28" },
  { title: "Workers",          url: "/admin/workers",      icon: HeartPulse,      accent: "#5DBCEB" },
  { title: "Events",           url: "/admin/events",       icon: Calendar,        accent: "#F28C28" },
  { title: "Analysis",         url: "/admin/analysis",     icon: PieChart,        accent: "#5DBCEB" },
  { title: "Reports",          url: "/admin/reports",      icon: FileText,        accent: "#F28C28" },
];

const coordinatorMenu = [
  { title: "Dashboard",        url: "/coordinator",            icon: LayoutDashboard, accent: "#5DBCEB" },
  { title: "Children",         url: "/coordinator/children",   icon: Users,           accent: "#F28C28" },
  { title: "Add Child",        url: "/coordinator/add-child",  icon: UserPlus,        accent: "#5DBCEB" },
  { title: "Programs",         url: "/coordinator/programs",   icon: Map,             accent: "#F28C28" },
  { title: "Food Distribution",url: "/coordinator/food",       icon: Utensils,        accent: "#5DBCEB" },
  { title: "Inventory",        url: "/coordinator/inventory",  icon: Package,         accent: "#F28C28" },
  { title: "Workers",          url: "/coordinator/workers",    icon: HeartPulse,      accent: "#5DBCEB" },
  { title: "Profile",          url: "/coordinator/profile",    icon: UserCircle,      accent: "#F28C28" },
];

export function AppSidebar() {
  const { role, setRole, setCurrentCoordinator } = useAppContext();
  const location = useLocation();
  const navigate  = useNavigate();
  const { state } = useSidebar();

  const menu      = role === "admin" ? adminMenu : coordinatorMenu;
  const isExpanded= state === "expanded";

  const handleExit = () => {
    setRole(null);
    setCurrentCoordinator(null);
    navigate("/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-none overflow-hidden shrink-0"
      style={{
        background: 'linear-gradient(185deg, #091E3A 0%, #0B6CC4 70%, #F28C28 100%)',
        margin: '0.75rem 0 0.75rem 0.75rem',
        borderRadius: '1.25rem',
        height: 'calc(100vh - 1.5rem)',
        boxShadow: '4px 0 32px rgba(13,34,68,0.45), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Logo ── */}
      <SidebarHeader className="flex h-[68px] items-center px-4 shrink-0 pt-4 pb-2">
        {isExpanded ? (
          <div className="flex items-center justify-between w-full overflow-hidden">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <img
                src="/logo.png"
                alt="Karma Logo"
                className="h-10 w-auto max-w-[125px] object-contain shrink-0"
                onError={e => { (e.target as HTMLImageElement).style.display='none'; }}
              />
              <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-[#5DBCEB] shrink-0">
                {role === "admin" ? "Admin" : "Field"}
              </span>
            </div>
            <SidebarTrigger className="text-white/40 hover:text-white hover:bg-white/10 rounded-lg h-7 w-7 shrink-0" />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full gap-2">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(93,188,235,0.15)', border: '1px solid rgba(93,188,235,0.3)' }}
            >
              <img
                src="/logo.png" alt="K"
                className="h-7 w-7 object-contain"
                onError={e => { (e.target as HTMLImageElement).style.display='none'; }}
              />
            </div>
            <SidebarTrigger className="text-white/40 hover:text-white hover:bg-white/10 rounded-lg h-7 w-7" />
          </div>
        )}
      </SidebarHeader>

      {/* ── Menu ── */}
      <SidebarContent className="flex-1 overflow-y-auto mt-1 px-2">
        {/* Thin orange separator */}
        <div
          className="mx-3 mb-3"
          style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(242,140,40,0.4), transparent)' }}
        />

        <SidebarGroup>
          {isExpanded && (
            <SidebarGroupLabel className="px-3 text-[9px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {role === "admin" ? "Administration" : "Field Ops"}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {menu.map(item => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="relative rounded-xl transition-all duration-200 h-10 group"
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${item.accent}22, ${item.accent}0a)`
                          : 'transparent',
                        border: isActive ? `1px solid ${item.accent}35` : '1px solid transparent',
                      }}
                    >
                      <Link to={item.url} className="flex items-center gap-2.5 px-2.5 w-full">
                        {/* Active left bar */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                            style={{ background: item.accent }}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className="h-7 w-7 flex items-center justify-center rounded-lg shrink-0 transition-all duration-200"
                          style={{
                            background: isActive ? `${item.accent}22` : 'rgba(255,255,255,0.06)',
                          }}
                        >
                          <item.icon
                            className="h-[15px] w-[15px]"
                            style={{ color: isActive ? item.accent : 'rgba(255,255,255,0.45)' }}
                          />
                        </div>

                        {/* Label */}
                        <span
                          className="text-[12.5px] font-medium truncate"
                          style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.5)' }}
                        >
                          {item.title}
                        </span>

                        {isActive && isExpanded && (
                          <ChevronRight
                            className="ml-auto h-3.5 w-3.5 shrink-0"
                            style={{ color: item.accent }}
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter
        className="p-3 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl h-10 hover:bg-red-500/10 transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              <div
                className="h-7 w-7 flex items-center justify-center rounded-lg shrink-0"
                style={{ background: 'rgba(217,43,43,0.12)', marginRight: isExpanded ? '0.625rem' : 0 }}
              >
                <ArrowLeftRight className="h-3.5 w-3.5" style={{ color: '#f87171' }} />
              </div>
              {isExpanded && <span className="text-[12.5px]">Switch Role</span>}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exit Dashboard</DialogTitle>
              <DialogDescription>Exit to the role selection screen?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleExit} className="bg-red-600 hover:bg-red-700">Exit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
