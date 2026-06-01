import { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "@/store";
import { Village } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowUpDown, ExternalLink, MapPin, Users, Activity, ShieldAlert, Heart, ClipboardList } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import "./AnalysisPage.css";

const COLORS = {
  Primary: "#0B6CC4",     // Karma Primary Blue
  Secondary: "#5DBCEB",   // Karma Light Blue
  Accent: "#F28C28",      // Karma Orange
  Destructive: "#D92B2B", // Karma Alert Red
  Success: "#10b981",     // Green
  Warning: "#F9C642",     // Karma Golden Yellow
  Muted: "#94a3b8"        // Slate
};

function InfoPill({ label, value }: { label: string; value: string | number }) {
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
      className="rounded-2xl overflow-hidden bg-white border border-sky-100/80 shadow-[0_2px_8px_rgba(93,188,235,0.05)]"
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

export default function AnalysisPage() {
  const { villages, children, workers, coordinators } = useAppContext();
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  const columns: ColumnDef<Village>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Village Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-semibold text-slate-800">{row.original.name}</span>,
    },
    {
      accessorKey: "district",
      header: "District",
    },
    {
      id: "childrenCount",
      header: "Total Children",
      cell: ({ row }) => children.filter(c => c.villageId === row.original.id).length,
    },
    {
      accessorKey: "riskLevel",
      header: "Risk Level",
      cell: ({ row }) => {
        const r = row.original.riskLevel;
        return (
          <Badge className={r === "High" ? "k-bg-destructive-soft k-text-destructive" : r === "Medium" ? "k-bg-warning-soft k-text-warning" : "k-bg-success-soft k-text-success"}>
            {r}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost" size="sm"
          onClick={() => setSelectedVillage(row.original)}
          className="rounded-xl text-xs font-semibold h-8 px-3 hover:text-white transition-all"
          style={{ color: '#5DBCEB', background: 'rgba(93,188,235,0.08)' }}
        >
          <ExternalLink size={13} className="mr-1" /> Analyze
        </Button>
      ),
    },
  ];

  const renderVillageAnalysis = (village: Village) => {
    const vChildren = children.filter(c => c.villageId === village.id);
    const vWorkers = workers.filter(w => w.villageId === village.id);
    const vCoord = coordinators.find(c => c.id === village.coordinatorId);

    // Nutrition
    const nutritionData = [
      { name: "Healthy", value: vChildren.filter(c => c.health.nutritionStatus === "Healthy").length, color: COLORS.Success },
      { name: "Malnourished", value: vChildren.filter(c => c.health.nutritionStatus === "Malnourished").length, color: COLORS.Warning },
      { name: "Sev. Malnourished", value: vChildren.filter(c => c.health.nutritionStatus === "Severely Malnourished").length, color: COLORS.Destructive },
    ];

    // Vaccination
    let vaxCompleted = 0; let vaxPending = 0; let vaxMissed = 0;
    vChildren.forEach(c => {
      c.vaccinations.forEach(v => {
        if(v.status === "Completed") vaxCompleted++;
        else if(v.status === "Pending") vaxPending++;
        else if(v.status === "Missed") vaxMissed++;
      });
    });
    const vaxData = [
      { name: "Completed", value: vaxCompleted, color: COLORS.Success },
      { name: "Pending", value: vaxPending, color: COLORS.Warning },
      { name: "Missed", value: vaxMissed, color: COLORS.Destructive },
    ];

    // Worker Roles
    const catMap: Record<string, number> = {};
    vWorkers.forEach(w => {
      const n = w.category.replace(" Worker", "").replace(" & Child Development", " Dev");
      catMap[n] = (catMap[n] || 0) + 1;
    });
    const workerCatData = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));
    const workerColors = [COLORS.Primary, COLORS.Accent, COLORS.Secondary, COLORS.Warning, COLORS.Destructive, COLORS.Success];

    // Risk Level
    const villageRiskData = [
      { name: "Risk Level", value: 1, color: village.riskLevel === "High" ? COLORS.Destructive : village.riskLevel === "Medium" ? COLORS.Warning : COLORS.Success, label: village.riskLevel }
    ];

    return (
      <div className="flex flex-col h-[92vh] overflow-hidden rounded-3xl">
        {/* Unified Premium Hero Header */}
        <div
          className="shrink-0 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D2244 0%, #0B6CC4 45%, #5DBCEB 75%, #F28C28 100%)', padding: '1.5rem' }}
        >
          {/* Decorative rings */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ background: '#F9C642' }} />
          <div className="absolute right-24 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: '#F28C28' }} />

          <div className="relative z-10 flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <MapPin size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>
                {village.name} Analysis
              </h2>
              <p className="text-white/70 text-xs mt-0.5">
                {village.district} District • {village.state} • Risk: {village.riskLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Unified Soft Sky-Blue Scrollable Body */}
        <div
          className="overflow-y-auto flex-1 p-5 space-y-4"
          style={{ background: '#F4F8FF', maxHeight: 'calc(92vh - 100px)' }}
        >
          {/* VILLAGE DETAILS PROFILE CARD (Task 4) */}
          <div className="grid md:grid-cols-2 gap-4">
            <SectionCard title="Village Location Info" icon={MapPin} color="#5DBCEB">
              <div className="grid grid-cols-2 gap-3">
                <InfoPill label="Village ID" value={village.id} />
                <InfoPill label="Risk Assessment" value={`${village.riskLevel} Level`} />
                <InfoPill label="District" value={village.district} />
                <InfoPill label="State" value={village.state} />
                <InfoPill label="Latitude" value={`${village.lat.toFixed(4)}° N`} />
                <InfoPill label="Longitude" value={`${village.lng.toFixed(4)}° E`} />
              </div>
            </SectionCard>

            <SectionCard title="Administrative Coverage" icon={Users} color="#F28C28">
              <div className="grid grid-cols-2 gap-3">
                <InfoPill label="Assigned Coordinator" value={vCoord?.name || "Unassigned"} />
                <InfoPill label="Coordinator Phone" value={vCoord?.phone || "—"} />
                <InfoPill label="Enrolled Children" value={vChildren.length} />
                <InfoPill label="Active Field Workers" value={vWorkers.length} />
                <div className="col-span-2">
                  <InfoPill label="Coordinator Email" value={vCoord?.email || "—"} />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Unified Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Nutrition */}
            <SectionCard title="Nutrition Status" icon={Heart} color="#5DBCEB">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={nutritionData} cx="50%" cy="50%" outerRadius={50} dataKey="value" stroke="white" strokeWidth={2}>
                      {nutritionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            {/* Vaccination */}
            <SectionCard title="Vaccination Status" icon={Activity} color="#F28C28">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={vaxData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" stroke="white" strokeWidth={2} paddingAngle={2}>
                      {vaxData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            {/* Worker Roles */}
            <SectionCard title="Worker Roles" icon={Users} color="#10b981">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {workerCatData.length > 0 ? (
                      <>
                        <Pie data={workerCatData} cx="50%" cy="50%" outerRadius={50} dataKey="value" stroke="white" strokeWidth={2}>
                          {workerCatData.map((e, i) => <Cell key={i} fill={workerColors[i % workerColors.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#64748b' }} />
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400 italic">No workers assigned</div>
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            {/* Risk Levels */}
            <SectionCard title="Risk Summary" icon={ShieldAlert} color="#F9C642">
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={villageRiskData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" stroke="white" strokeWidth={2}>
                      {villageRiskData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <RechartsTooltip formatter={(value: any, name: any, props: any) => [props.payload.label, "Risk Level"]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>

          {/* Children List Table */}
          <SectionCard title={`Enrolled Children (${vChildren.length})`} icon={ClipboardList} color="#0B6CC4">
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden mt-1">
              <DataTable 
                columns={[
                  { accessorKey: "name", header: "Name" },
                  { accessorKey: "age", header: "Age", cell: ({ row }) => `${row.original.age} Yrs` },
                  { accessorKey: "gender", header: "Gender" },
                  { accessorKey: "health.nutritionStatus", header: "Nutrition Status", cell: ({ row }) => (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.original.health.nutritionStatus === "Healthy" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {row.original.health.nutritionStatus}
                    </span>
                  )}
                ]} 
                data={vChildren} 
                searchKey="name" 
                searchPlaceholder="Search children in village..." 
              />
            </div>
          </SectionCard>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-8 k-page-bg">
      <div>
        <h2 className="text-2xl font-black text-slate-800" style={{ fontFamily: 'Outfit,sans-serif' }}>
          Village Analysis
        </h2>
        <p className="k-text-muted text-sm text-slate-500 mt-0.5">
          Analyze detailed statistics and children information by village.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-[0_4px_24px_rgba(93,188,235,0.06)]">
        <DataTable 
          columns={columns} 
          data={villages} 
          searchKey="name" 
          searchPlaceholder="Search villages..." 
        />
      </div>

      <Dialog open={!!selectedVillage} onOpenChange={(open) => !open && setSelectedVillage(null)}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          {selectedVillage && renderVillageAnalysis(selectedVillage)}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
