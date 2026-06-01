import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown, ExternalLink, Activity, Syringe, CalendarHeart,
  HandHeart, Info, ActivitySquare, History, Phone, MapPin,
  User, Heart, Shield, TrendingUp, Baby, Home, Leaf
} from "lucide-react";
import { useAppContext } from "@/store";
import { Child } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";

/* ── helpers ── */
const riskStyle = (r: string) =>
  r === "High"   ? { bg: "rgba(217,43,43,0.1)",   color: "#991b1b", border: "rgba(217,43,43,0.25)"   } :
  r === "Medium" ? { bg: "rgba(242,140,40,0.12)",  color: "#92400e", border: "rgba(242,140,40,0.3)"  } :
                   { bg: "rgba(93,188,235,0.12)",   color: "#1e40af", border: "rgba(93,188,235,0.3)"  };

const nutritionStyle = (s: string) =>
  s === "Healthy"              ? { bg: "rgba(16,185,129,0.12)", color: "#065f46" } :
  s === "Malnourished"         ? { bg: "rgba(249,198,66,0.15)", color: "#92400e" } :
                                 { bg: "rgba(217,43,43,0.1)",   color: "#991b1b" };

function InfoPill({ label, value, color = "#5DBCEB" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>{label}</span>
      <span className="text-sm font-semibold text-slate-700">{value || "—"}</span>
    </div>
  );
}

function SectionCard({ title, icon: Icon, color = "#5DBCEB", children }: {
  title: string; icon: any; color?: string; children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        border: '1px solid rgba(226,232,240,0.8)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{ background: `linear-gradient(135deg, ${color}12, ${color}05)`, borderBottom: `1px solid ${color}20` }}
      >
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className="font-bold text-sm text-slate-700" style={{ fontFamily: 'Outfit,sans-serif' }}>{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatChip({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{ background: `linear-gradient(135deg,${color}18,${color}08)`, border: `1px solid ${color}25` }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: `${color}cc` }}>{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{unit}</p>
    </div>
  );
}

export default function ChildrenPage() {
  const { children, villages, coordinators } = useAppContext();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const getVillageName = (id: string) => villages.find(v => v.id === id)?.name || id;
  const getCoordName   = (id: string) => coordinators.find(c => c.id === id)?.name || "—";

  const columns: ColumnDef<Child>[] = [
    {
      accessorKey: "photo",
      header: "",
      cell: ({ row }) => (
        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
          <AvatarImage src={row.original.photo} />
          <AvatarFallback className="text-xs font-bold" style={{ background: 'linear-gradient(135deg,#5DBCEB,#0B6CC4)', color: 'white' }}>
            {row.original.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-bold text-slate-600" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-semibold text-slate-800">{row.original.name}</span>,
    },
    { accessorKey: "age", header: "Age", cell: ({ row }) => <span className="font-medium">{row.original.age} yrs</span> },
    { accessorKey: "gender", header: "Gender" },
    {
      accessorKey: "villageId",
      header: "Village",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-slate-600">
          <MapPin size={11} style={{ color: '#5DBCEB' }} /> {getVillageName(row.original.villageId)}
        </span>
      ),
    },
    {
      id: "nutrition",
      header: "Nutrition",
      cell: ({ row }) => {
        const s = row.original.health.nutritionStatus;
        const st = nutritionStyle(s);
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border" style={{ background: st.bg, color: st.color, borderColor: `${st.color}40` }}>
            {s}
          </span>
        );
      },
    },
    {
      accessorKey: "riskLevel",
      header: "Risk",
      cell: ({ row }) => {
        const r = row.original.riskLevel;
        const st = riskStyle(r);
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border" style={{ background: st.bg, color: st.color, borderColor: st.border }}>
            {r}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost" size="sm"
          onClick={() => setSelectedChild(row.original)}
          className="rounded-xl text-xs font-semibold h-8 px-3 hover:text-white transition-all"
          style={{ color: '#5DBCEB', background: 'rgba(93,188,235,0.08)' }}
        >
          <ExternalLink size={13} className="mr-1" /> View
        </Button>
      ),
    },
  ];

  /* ── Child Detail Dialog ── */
  const renderChildDetail = (child: Child) => {
    const rs = riskStyle(child.riskLevel);
    const ns = nutritionStyle(child.health.nutritionStatus);

    return (
      <div className="flex flex-col h-[92vh] overflow-hidden rounded-3xl">
        {/* ── HERO HEADER ── */}
        <div
          className="shrink-0 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D2244 0%, #0B6CC4 45%, #5DBCEB 75%, #F28C28 100%)', minHeight: 160 }}
        >
          {/* decorative rings */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ background: '#F9C642' }} />
          <div className="absolute right-24 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: '#F28C28' }} />

          <div className="relative z-10 p-6 flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 ring-4 ring-white/30 shadow-2xl">
                <AvatarImage src={child.photo} />
                <AvatarFallback className="text-3xl font-black text-white" style={{ background: 'rgba(93,188,235,0.3)' }}>
                  {child.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-400 border-2 border-white rounded-full" />
            </div>

            {/* Info */}
            <div className="flex-1 mt-1">
              <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Outfit,sans-serif' }}>{child.name}</h2>
              <p className="text-white/70 text-sm mb-3">
                {child.age} yrs • {child.gender} • {getVillageName(child.villageId)}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{ background: rs.bg, color: rs.color, borderColor: rs.border }}>
                  {child.riskLevel} Risk
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{ background: ns.bg, color: ns.color, borderColor: `${ns.color}40` }}>
                  {child.health.nutritionStatus}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: child.status === "Active" ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)', color: child.status === "Active" ? '#34d399' : '#94a3b8' }}>
                  {child.status}
                </span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="hidden md:flex flex-col items-end gap-2 text-right">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2">
                <p className="text-2xl font-black text-white">{child.visits.length}</p>
                <p className="text-[10px] text-white/60 font-medium">Visits</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2">
                <p className="text-2xl font-black text-white">{child.interventions.length}</p>
                <p className="text-[10px] text-white/60 font-medium">Interventions</p>
              </div>
            </div>
          </div>

          {/* Tab strip */}
          <div className="px-6 pb-0 relative z-10">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList
                className="w-full justify-start bg-transparent h-auto p-0 space-x-1 border-b border-white/15 rounded-none"
              >
                {[
                  { val: "overview",      label: "Overview",       icon: Info },
                  { val: "health",        label: "Health",         icon: Heart },
                  { val: "vaccinations",  label: "Vaccines",       icon: Shield },
                  { val: "growth",        label: "Milestones",     icon: TrendingUp },
                  { val: "interventions", label: "Interventions",  icon: HandHeart },
                  { val: "visits",        label: "Visits",         icon: CalendarHeart },
                  { val: "history",       label: "History",        icon: History },
                ].map(t => (
                  <TabsTrigger
                    key={t.val} value={t.val}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-none text-[11px] font-bold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#5DBCEB] data-[state=inactive]:text-white/45 bg-transparent border-b-2 border-transparent transition-all"
                  >
                    <t.icon size={13} /> {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ── Scrollable body ── */}
              <div
                className="overflow-y-auto flex-1"
                style={{ maxHeight: 'calc(92vh - 220px)', background: '#F4F8FF' }}
              >

                {/* OVERVIEW */}
                <TabsContent value="overview" className="m-0 p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <SectionCard title="Identity & Registration" icon={User} color="#5DBCEB">
                      <div className="grid grid-cols-2 gap-3">
                        <InfoPill label="Aadhaar" value={child.aadhaar} />
                        <InfoPill label="Date of Birth" value={new Date(child.dob).toLocaleDateString()} />
                        <InfoPill label="Age" value={`${child.age} Years`} />
                        <InfoPill label="Gender" value={child.gender} />
                        <InfoPill label="Phone" value={child.phone} />
                        <InfoPill label="Status" value={child.status} />
                        <div className="col-span-2"><InfoPill label="Address" value={child.address} /></div>
                        <div className="col-span-2"><InfoPill label="Coordinator" value={getCoordName(child.coordinatorId)} /></div>
                        <div className="col-span-2"><InfoPill label="Village" value={getVillageName(child.villageId)} /></div>
                      </div>
                    </SectionCard>

                    <div className="space-y-4">
                      <SectionCard title="Father's Information" icon={User} color="#F28C28">
                        <div className="grid grid-cols-1 gap-2">
                          <InfoPill label="Name" value={child.fatherName} />
                          <InfoPill label="Aadhaar" value={child.fatherAadhaar} />
                        </div>
                      </SectionCard>
                      <SectionCard title="Mother's Information" icon={Baby} color="#F9C642">
                        <div className="grid grid-cols-1 gap-2">
                          <InfoPill label="Name" value={child.motherName} />
                          <InfoPill label="Aadhaar" value={child.motherAadhaar} />
                        </div>
                      </SectionCard>
                    </div>
                  </div>

                  {/* Quick health snapshot */}
                  <SectionCard title="Current Health Snapshot" icon={Heart} color="#D92B2B">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      <StatChip label="Height" value={child.health.height} unit="cm" color="#5DBCEB" />
                      <StatChip label="Weight" value={child.health.weight} unit="kg" color="#F28C28" />
                      <StatChip label="MUAC" value={child.health.muac} unit="cm" color="#10b981" />
                      <StatChip label="BMI" value={child.health.bmi} unit="kg/m²" color="#F9C642" />
                      <div className="col-span-2 rounded-2xl p-4 flex flex-col justify-center" style={{ background: ns.bg, border: `1px solid ${ns.color}30` }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: `${ns.color}aa` }}>Nutrition</p>
                        <p className="text-base font-black leading-tight" style={{ color: ns.color }}>{child.health.nutritionStatus}</p>
                        <p className="text-[11px] mt-1 text-slate-500">Last: {new Date(child.health.lastCheckup).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </SectionCard>
                </TabsContent>

                {/* HEALTH */}
                <TabsContent value="health" className="m-0 p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <StatChip label="Height" value={child.health.height} unit="cm" color="#5DBCEB" />
                    <StatChip label="Weight" value={child.health.weight} unit="kg" color="#F28C28" />
                    <StatChip label="MUAC" value={child.health.muac} unit="cm" color="#10b981" />
                  </div>
                  <div className="rounded-2xl p-4 bg-white border border-slate-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h4 className="font-bold text-sm text-slate-700 mb-3" style={{ fontFamily: 'Outfit,sans-serif' }}>Growth History Chart</h4>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={child.healthHistory}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="date" tickFormatter={v => new Date(v).toLocaleDateString(undefined, { month: 'short' })} fontSize={11} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="l" fontSize={11} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="r" orientation="right" fontSize={11} axisLine={false} tickLine={false} />
                          <RechartsTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                          <Legend />
                          <Line yAxisId="l" type="monotone" dataKey="height" name="Height (cm)" stroke="#5DBCEB" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#5DBCEB' }} />
                          <Line yAxisId="r" type="monotone" dataKey="weight" name="Weight (kg)"  stroke="#F28C28" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#F28C28' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>

                {/* VACCINATIONS */}
                <TabsContent value="vaccinations" className="m-0 p-5">
                  <div className="grid grid-cols-1 gap-3">
                    {["BCG", "OPV", "DPT", "Measles", "Polio"].map(vName => {
                      const rec = child.vaccinations.find(v => v.name === vName);
                      const status = rec?.status || "Pending";
                      const color = status === "Completed" ? "#10b981" : status === "Missed" ? "#D92B2B" : "#F9C642";
                      return (
                        <div key={vName} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                              <Syringe size={16} style={{ color }} />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">{vName}</p>
                              <p className="text-[11px] text-slate-500">{rec?.date ? `Administered: ${new Date(rec.date).toLocaleDateString()}` : "No date recorded"}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold border" style={{ background: `${color}15`, color, borderColor: `${color}35` }}>
                            {status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* GROWTH MILESTONES */}
                <TabsContent value="growth" className="m-0 p-5">
                  <div className="grid grid-cols-2 gap-4">
                    {["Walking", "Speaking", "Learning Skills", "Social Skills"].map(ms => {
                      const rec = child.milestones.find(m => m.name === ms);
                      const status = rec?.status || "Pending";
                      const color = status === "Achieved" ? "#10b981" : status === "Delayed" ? "#D92B2B" : "#F9C642";
                      return (
                        <div key={ms} className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col gap-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                          <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}15` }}>
                            <ActivitySquare size={20} style={{ color }} />
                          </div>
                          <p className="font-bold text-slate-800">{ms}</p>
                          <span className="inline-flex w-fit px-2.5 py-1 rounded-full text-[11px] font-bold border" style={{ background: `${color}15`, color, borderColor: `${color}35` }}>
                            {status}
                          </span>
                          <p className="text-[11px] text-slate-400">{rec?.date ? `Recorded: ${new Date(rec.date).toLocaleDateString()}` : "Awaiting observation"}</p>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* INTERVENTIONS */}
                <TabsContent value="interventions" className="m-0 p-5">
                  {child.interventions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">No interventions recorded.</div>
                  ) : (
                    <div className="space-y-3">
                      {child.interventions.map(int => (
                        <div key={int.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex gap-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(242,140,40,0.12)' }}>
                            <HandHeart size={18} style={{ color: '#F28C28' }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-slate-800">{int.type}</span>
                              <span className="text-[11px] text-slate-400">{new Date(int.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-600">{int.description}</p>
                            {int.result && <p className="text-[11px] text-slate-400 mt-1 italic">Outcome: {int.result}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* VISITS */}
                <TabsContent value="visits" className="m-0 p-5">
                  {child.visits.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">No visits recorded.</div>
                  ) : (
                    <div className="space-y-3">
                      {child.visits.map(v => {
                        const d = new Date(v.date);
                        const color = v.status === "Completed" ? "#10b981" : v.status === "Missed" ? "#D92B2B" : "#5DBCEB";
                        return (
                          <div key={v.id} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div className="flex flex-col items-center justify-center rounded-xl text-center px-3 py-2 shrink-0" style={{ background: `${color}12`, minWidth: 58 }}>
                              <span className="text-[10px] font-bold uppercase" style={{ color }}>{d.toLocaleString('default', { month: 'short' })}</span>
                              <span className="text-xl font-black" style={{ color }}>{d.getDate()}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-sm text-slate-800">{v.type}</p>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border" style={{ background: `${color}12`, color, borderColor: `${color}30` }}>{v.status}</span>
                              </div>
                              <p className="text-sm text-slate-500">{v.observation || "No observations recorded."}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                {/* HISTORY */}
                <TabsContent value="history" className="m-0 p-5">
                  <div className="relative ml-4 pl-6 space-y-5" style={{ borderLeft: '2px solid rgba(93,188,235,0.25)' }}>
                    {[
                      { time: "2 months ago",  title: "Vaccination Updated",          desc: "DPT dose administered." },
                      { time: "4 months ago",  title: "Home Visit Completed",         desc: "Nutritional counselling provided to parents." },
                      { time: "6 months ago",  title: "Intervention Plan Created",    desc: "Enrolled in supplement program." },
                      { time: "1 year ago",    title: "Initial Registration",         desc: "Child enrolled by Coordinator." },
                    ].map((entry, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[31px] h-5 w-5 rounded-full border-2 border-white flex items-center justify-center" style={{ background: i === 0 ? 'linear-gradient(135deg,#5DBCEB,#0B6CC4)' : '#e2e8f0' }}>
                          <History size={10} style={{ color: i === 0 ? 'white' : '#94a3b8' }} />
                        </div>
                        <p className="text-[11px] text-slate-400 mb-0.5">{entry.time}</p>
                        <p className="font-bold text-sm text-slate-700">{entry.title}</p>
                        <p className="text-[12px] text-slate-500">{entry.desc}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

              </div>
            </Tabs>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800" style={{ fontFamily: 'Outfit,sans-serif' }}>
            Child Management
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Full health, nutrition & vaccination records for all enrolled children.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(93,188,235,0.1)', color: '#0B6CC4' }}>
            {children.length} Children
          </div>
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(217,43,43,0.08)', color: '#D92B2B' }}>
            {children.filter(c => c.riskLevel === "High").length} High Risk
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 4px 20px rgba(93,188,235,0.07)'
        }}
      >
        <DataTable
          columns={columns}
          data={children}
          searchKey="name"
          searchPlaceholder="Search by child name…"
        />
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedChild} onOpenChange={open => !open && setSelectedChild(null)}>
        <DialogContent className="max-w-5xl p-0 border-none shadow-2xl overflow-hidden rounded-3xl">
          {selectedChild && renderChildDetail(selectedChild)}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
