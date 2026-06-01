import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAppContext } from "@/store";
import { Bell } from "lucide-react";

export default function MainLayout() {
  const { role, currentCoordinator } = useAppContext();
  if (!role) return <Navigate to="/" replace />;

  const pageName = role === "admin" ? "Admin Portal" : currentCoordinator?.name ?? "Coordinator";
  const subName  = role === "admin" ? "Karma Foundation NGO ERP" : "Field Coordinator Portal";

  return (
    <SidebarProvider>
      <div
        className="flex min-h-screen w-full"
        style={{ background: 'linear-gradient(145deg, #EBF6FF 0%, #FFF8EC 50%, #FFFDE8 100%)' }}
      >
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* ── Top Navbar ── */}
          <header
            className="h-[60px] mx-3 md:mx-4 mt-3 rounded-2xl flex items-center justify-between px-5 sticky top-3 z-20"
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 2px 16px rgba(93,188,235,0.1), 0 1px 0 rgba(255,255,255,0.9) inset',
            }}
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors" />
              <div
                className="w-0.5 h-8 rounded-full hidden sm:block"
                style={{ background: 'linear-gradient(180deg,#5DBCEB,#F28C28)' }}
              />
              <div className="hidden sm:block">
                <p className="font-bold text-sm text-slate-800 leading-none" style={{ fontFamily: 'Outfit,sans-serif' }}>
                  {pageName}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{subName}</p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Status pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-700">Live</span>
              </div>

              {/* Bell */}
              <button className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-sky-50 transition-colors relative">
                <Bell size={16} className="text-slate-500" />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
                  style={{ background: '#F28C28' }}
                />
              </button>

              {/* Avatar */}
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm cursor-pointer select-none"
                style={{ background: 'linear-gradient(135deg,#5DBCEB,#0B6CC4)' }}
                title={pageName}
              >
                {role === "admin" ? "A" : (currentCoordinator?.name?.[0] ?? "C")}
              </div>
            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-y-auto p-3 md:p-4 pt-4">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
