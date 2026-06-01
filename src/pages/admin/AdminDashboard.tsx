import { Users, MapPin, ShieldCheck, Box, TrendingUp, Activity } from "lucide-react";
import { useAppContext } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from "recharts";
import { motion, Variants } from "framer-motion";
import { MapComponent, MapMarker } from "@/components/shared/MapComponent";
import { Badge } from "@/components/ui/badge";
import "./AdminDashboard.css";

const COLORS = {
  Primary: "#0B6CC4",
  Secondary: "#5DBCEB",
  Accent: "#F28C28",
  Destructive: "#D92B2B",
  Success: "#10b981",
  Warning: "#F9C642",
  Muted: "#94a3b8"
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-bold">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { children, coordinators, workers, foodDistribution, villages, programs, events, inventory } = useAppContext();

  const totalChildren = children.length;
  const totalVillages = villages.length;
  const totalFoodDist = foodDistribution.reduce((acc, f) => acc + f.quantity, 0);
  const totalWorkers = workers.length;
  const totalCoordinators = coordinators.length;
  const activePrograms = programs.filter(p => p.status === "Ongoing").length;

  // Children by District
  const distMap: Record<string, number> = {};
  children.forEach(c => {
    const dist = villages.find(v => v.id === c.villageId)?.district || "Unknown";
    distMap[dist] = (distMap[dist] || 0) + 1;
  });
  const childrenByDistrict = Object.keys(distMap).map(k => ({ name: k, count: distMap[k] }));

  // Food Trend
  const foodTrendMap: Record<string, number> = {};
  foodDistribution.forEach(f => {
    const d = new Date(f.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    foodTrendMap[d] = (foodTrendMap[d] || 0) + f.quantity;
  });
  const foodTrendData = Object.keys(foodTrendMap).sort().map(k => ({ date: k, quantity: foodTrendMap[k] }));

  // Map markers
  const mapMarkers: MapMarker[] = villages.map(v => {
    const vChildrenCount = children.filter(c => c.villageId === v.id).length;
    return {
      id: v.id,
      lat: v.lat,
      lng: v.lng,
      title: v.name,
      popupContent: (
        <div className="font-sans text-sm p-1">
          <p className="font-bold text-base text-slate-800">{v.name}</p>
          <p className="text-slate-500 text-xs mb-2">{v.district} District</p>
          <p className="text-slate-700">Children: <span className="font-semibold">{vChildrenCount}</span></p>
          <span
            className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: v.riskLevel === 'High' ? 'rgba(217,43,43,0.1)' : v.riskLevel === 'Medium' ? 'rgba(249,198,66,0.15)' : 'rgba(11,108,196,0.1)',
              color: v.riskLevel === 'High' ? '#991b1b' : v.riskLevel === 'Medium' ? '#92400e' : '#1e40af'
            }}
          >
            {v.riskLevel} Risk
          </span>
        </div>
      )
    };
  });

  const kpiCards = [
    {
      label: "Children Monitored",
      value: totalChildren,
      icon: Users,
      gradient: "linear-gradient(135deg, #0B6CC4 0%, #5DBCEB 100%)",
      lightBg: "rgba(11,108,196,0.08)",
      change: "+12%"
    },
    {
      label: "Villages Reached",
      value: totalVillages,
      icon: MapPin,
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
      lightBg: "rgba(16,185,129,0.08)",
      change: "+5%"
    },
    {
      label: "Food Distributed",
      value: `${totalFoodDist} u`,
      icon: Box,
      gradient: "linear-gradient(135deg, #F28C28 0%, #F9C642 100%)",
      lightBg: "rgba(242,140,40,0.08)",
      change: "+8%"
    },
    {
      label: "Field Workers",
      value: totalWorkers,
      icon: Activity,
      gradient: "linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)",
      lightBg: "rgba(167,139,250,0.08)",
      change: "Stable"
    },
    {
      label: "Coordinators",
      value: totalCoordinators,
      icon: ShieldCheck,
      gradient: "linear-gradient(135deg, #f472b6 0%, #fb923c 100%)",
      lightBg: "rgba(244,114,182,0.08)",
      change: "Stable"
    },
    {
      label: "Active Programs",
      value: activePrograms,
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, #D92B2B 0%, #ef4444 100%)",
      lightBg: "rgba(217,43,43,0.08)",
      change: "+2"
    },
  ];

  const glassCard = {
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.6)',
    boxShadow: '0 4px 20px rgba(11,108,196,0.06)',
    borderRadius: '1.25rem'
  };

  return (
    <motion.div className="space-y-6 pb-12" variants={container} initial="hidden" animate="show">

      {/* Hero Banner */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #0D1B3E 0%, #1a3a7a 50%, #0B6CC4 100%)',
          boxShadow: '0 20px 60px rgba(13,27,62,0.35)'
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10" style={{ background: '#5DBCEB' }} />
        <div className="absolute right-32 -bottom-12 w-40 h-40 rounded-full opacity-10" style={{ background: '#F28C28' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5" style={{ background: '#fff', transform: 'translate(-30%,-50%)' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="" className="h-8 w-8 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
              <span className="text-[11px] font-bold tracking-widest opacity-70 uppercase">Karma Foundation</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              NGO Analytics & Insights
            </h2>
            <p className="opacity-70 text-sm">Comprehensive overview of operations across all villages.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-black">{programs.filter(p => p.status === "Ongoing").length}</p>
              <p className="text-[11px] opacity-70 font-medium mt-0.5">Active Programs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-black">{events.filter(e => e.status === "Upcoming").length}</p>
              <p className="text-[11px] opacity-70 font-medium mt-0.5">Upcoming Events</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-black">{children.filter(c => c.riskLevel === "High").length}</p>
              <p className="text-[11px] opacity-70 font-medium mt-0.5">High Risk Kids</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card, idx) => (
          <motion.div key={idx} variants={item}>
            <div
              className="relative overflow-hidden rounded-2xl p-4 group cursor-default transition-all duration-300 hover:-translate-y-1"
              style={{
                ...glassCard,
                boxShadow: '0 4px 20px rgba(11,108,196,0.06)'
              }}
            >
              <div
                className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"
                style={{ background: card.gradient }}
              />
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: card.lightBg }}
              >
                <card.icon size={18} style={{ color: card.gradient.includes('10b981') ? '#10b981' : card.gradient.includes('F28C28') ? '#F28C28' : card.gradient.includes('a78bfa') ? '#a78bfa' : card.gradient.includes('f472b6') ? '#f472b6' : card.gradient.includes('D92B2B') ? '#D92B2B' : '#0B6CC4' }} />
              </div>
              <p className="text-2xl font-black text-slate-800 mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{card.value}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-tight">{card.label}</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{card.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SVG Gradients */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0B6CC4" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#5DBCEB" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="gradAccent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F28C28" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#F9C642" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
      </svg>

      {/* Charts Row */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-5">

        {/* Food Distribution Trend - Wide */}
        <motion.div variants={item} className="lg:col-span-3">
          <div style={glassCard} className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Food Distribution Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Units distributed over time</p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">All Villages</span>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={foodTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFoodFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B6CC4" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#5DBCEB" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} dy={8} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dx={-5} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="quantity"
                    name="Units"
                    stroke="#0B6CC4"
                    strokeWidth={3}
                    fill="url(#colorFoodFill)"
                    dot={false}
                    activeDot={{ r: 6, fill: '#0B6CC4', strokeWidth: 3, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Children by District - Narrow */}
        <motion.div variants={item} className="lg:col-span-2">
          <div style={glassCard} className="p-5 h-full">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Children by District</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution across districts</p>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={childrenByDistrict} margin={{ left: -20, right: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} dy={8} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Children" fill="url(#gradPrimary)" radius={[8, 8, 4, 4]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Map */}
      <motion.div variants={item}>
        <div style={glassCard} className="overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(11,108,196,0.1)' }}>
                <MapPin size={16} style={{ color: '#0B6CC4' }} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Village Coverage & Risk Map</h3>
                <p className="text-xs text-slate-500">Click markers to view village details</p>
              </div>
            </div>
            {/* Risk legend */}
            <div className="hidden md:flex items-center gap-3">
              {[
                { label: "High Risk", color: "#D92B2B" },
                { label: "Medium Risk", color: "#F9C642" },
                { label: "Low Risk", color: "#0B6CC4" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-[11px] font-medium text-slate-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[380px] relative z-0">
            {villages.length > 0 ? (
              <MapComponent
                markers={mapMarkers}
                center={[villages[0].lat, villages[0].lng]}
                zoom={7}
                className="h-full w-full"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No villages configured</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Recent Activity + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recent Events */}
        <motion.div variants={item}>
          <div style={glassCard} className="p-5">
            <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Recent Events</h3>
            <div className="space-y-3">
              {events.slice(0, 4).map(e => (
                <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{ background: e.status === "Completed" ? 'linear-gradient(135deg,#10b981,#34d399)' : e.status === "Upcoming" ? 'linear-gradient(135deg,#0B6CC4,#5DBCEB)' : 'linear-gradient(135deg,#F28C28,#F9C642)' }}
                  >
                    {e.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{e.name}</p>
                    <p className="text-[11px] text-slate-500">{e.location} · {new Date(e.date).toLocaleDateString()}</p>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: e.status === "Completed" ? 'rgba(16,185,129,0.1)' : e.status === "Upcoming" ? 'rgba(11,108,196,0.1)' : 'rgba(242,140,40,0.1)',
                      color: e.status === "Completed" ? '#065f46' : e.status === "Upcoming" ? '#1e40af' : '#92400e'
                    }}
                  >
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Risk Summary */}
        <motion.div variants={item}>
          <div style={glassCard} className="p-5">
            <h3 className="font-bold text-slate-800 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Child Risk Summary</h3>
            <div className="space-y-4">
              {[
                { label: "High Risk", count: children.filter(c => c.riskLevel === "High").length, total: children.length, color: "#D92B2B", bg: "rgba(217,43,43,0.1)" },
                { label: "Medium Risk", count: children.filter(c => c.riskLevel === "Medium").length, total: children.length, color: "#F9C642", bg: "rgba(249,198,66,0.15)" },
                { label: "Low Risk", count: children.filter(c => c.riskLevel === "Low").length, total: children.length, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                      <span className="text-sm font-semibold text-slate-700">{r.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{r.count} <span className="text-slate-400 font-normal">/ {r.total}</span></span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-slate-100">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: r.total > 0 ? `${(r.count / r.total) * 100}%` : 0 }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      style={{ background: r.color }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-3 mt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Inventory Status</h4>
                {[
                  { label: "In Stock", count: inventory.filter(i => i.status === "In Stock").length, color: "#10b981" },
                  { label: "Low Stock", count: inventory.filter(i => i.status === "Low Stock").length, color: "#F9C642" },
                  { label: "Out of Stock", count: inventory.filter(i => i.status === "Out of Stock").length, color: "#D92B2B" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-600">{s.label}</span>
                    <Badge
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border-0"
                      style={{ background: `${s.color}18`, color: s.color }}
                    >
                      {s.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
