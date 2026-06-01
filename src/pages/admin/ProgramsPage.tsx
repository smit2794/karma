import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown, ExternalLink, Calendar, Users, MapPin,
  ClipboardList, Activity, Plus, Check, X
} from "lucide-react";
import { useAppContext } from "@/store";
import { Program } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./ProgramsPage.css";

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

/* ── Helpers ── */
const catColors: Record<string, string> = {
  Nutrition: "#5DBCEB", Health: "#D92B2B", Education: "#10b981",
  Vaccination: "#F28C28", "Women Empowerment": "#a78bfa",
  "Child Development": "#F9C642", "Skill Development": "#f472b6",
};

const statusColor = (s: string) =>
  s === "Ongoing"   ? { bg: "rgba(249,198,66,0.14)",   color: "#92400e",  border: "rgba(249,198,66,0.4)" }  :
  s === "Completed" ? { bg: "rgba(16,185,129,0.1)",    color: "#065f46",  border: "rgba(16,185,129,0.3)" }  :
                      { bg: "rgba(93,188,235,0.12)",   color: "#1e40af",  border: "rgba(93,188,235,0.3)" };

const glassCard = {
  background: 'rgba(255,255,255,0.9)',
  border: '1px solid rgba(226,232,240,0.8)',
  borderRadius: '1.125rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};

/* ── Create Program Form State ── */
interface NewProgram {
  name: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  coordinatorId: string;
}

const defaultNewProgram: NewProgram = {
  name: "", category: "", description: "", startDate: "",
  endDate: "", status: "Planned", coordinatorId: "",
};

/* ── Create Program Modal ── */
function CreateProgramModal({ open, onClose, onSave, coordinators }: {
  open: boolean;
  onClose: () => void;
  onSave: (p: NewProgram) => void;
  coordinators: any[];
}) {
  const [form, setForm] = useState<NewProgram>(defaultNewProgram);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof NewProgram) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onSave(form);
      setSaving(false);
      setForm(defaultNewProgram);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(13,34,68,0.55)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="w-full max-w-2xl rounded-3xl overflow-hidden"
            style={{ background: 'white', boxShadow: '0 32px 80px rgba(13,34,68,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#0D2244,#0B3D78,#5DBCEB)' }}
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10" style={{ background: '#F9C642' }} />
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(93,188,235,0.25)', border: '1px solid rgba(93,188,235,0.4)' }}>
                    <Plus size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>Create New Program</h3>
                    <p className="text-white/60 text-xs mt-0.5">Fill in the program details below</p>
                  </div>
                </div>
                <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Program Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="field-label">Program Name <span className="text-red-500">*</span></label>
                  <input required value={form.name} onChange={set("name")} className="field-input" placeholder="e.g. Sanand Nutrition Drive 2024" />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="field-label">Category <span className="text-red-500">*</span></label>
                  <select required value={form.category} onChange={set("category")} className="field-select">
                    <option value="">Select Category</option>
                    {["Nutrition","Health","Education","Vaccination","Women Empowerment","Child Development","Skill Development"].map(c =>
                      <option key={c} value={c}>{c}</option>
                    )}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="field-label">Status</label>
                  <select value={form.status} onChange={set("status")} className="field-select">
                    {["Planned","Ongoing","Completed"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Coordinator */}
                <div className="space-y-1.5">
                  <label className="field-label">Assigned Coordinator</label>
                  <select value={form.coordinatorId} onChange={set("coordinatorId")} className="field-select">
                    <option value="">Select Coordinator</option>
                    {coordinators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="field-label">Start Date <span className="text-red-500">*</span></label>
                  <input required type="date" value={form.startDate} onChange={set("startDate")} className="field-input" />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="field-label">End Date <span className="text-red-500">*</span></label>
                  <input required type="date" value={form.endDate} onChange={set("endDate")} className="field-input" />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="field-label">Description</label>
                  <textarea rows={3} value={form.description} onChange={set("description")} className="field-input resize-none" placeholder="Describe the program goals, beneficiaries, and scope…" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all hover:opacity-90 active:scale-95"
                  style={{ background: saving ? '#94a3b8' : 'linear-gradient(135deg,#5DBCEB,#0B6CC4)', boxShadow: '0 4px 16px rgba(93,188,235,0.4)' }}
                >
                  {saving ? (
                    <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                  ) : (
                    <><Check size={16} /> Create Program</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main Page ── */
export default function ProgramsPage() {
  const { programs, coordinators, villages, workers, children, addProgram } = useAppContext();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getCoordinatorName = (id: string) => coordinators.find(c => c.id === id)?.name || "—";

  const handleSave = (form: NewProgram) => {
    const newProg: Program = {
      id: `PRG${Date.now()}`,
      name: form.name,
      category: form.category as any,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status as any,
      coordinatorId: form.coordinatorId,
      villageIds: [],
      workerIds: [],
    };
    addProgram(newProg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const columns: ColumnDef<Program>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-bold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Program <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const c = catColors[row.original.category] || "#5DBCEB";
        return (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c}18` }}>
              <ClipboardList size={14} style={{ color: c }} />
            </div>
            <span className="font-semibold text-slate-800 text-sm">{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const c = catColors[row.original.category] || "#5DBCEB";
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border" style={{ background: `${c}15`, color: c, borderColor: `${c}35` }}>
            {row.original.category}
          </span>
        );
      },
    },
    {
      accessorKey: "coordinatorId",
      header: "Coordinator",
      cell: ({ row }) => {
        const coord = coordinators.find(c => c.id === row.original.coordinatorId);
        return coord ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6"><AvatarImage src={coord.photo} /><AvatarFallback className="text-[10px]">{coord.name[0]}</AvatarFallback></Avatar>
            <span className="text-sm text-slate-700">{coord.name}</span>
          </div>
        ) : <span className="text-slate-400 text-sm">—</span>;
      },
    },
    {
      id: "childrenCovered",
      header: "Children",
      cell: ({ row }) => {
        const count = children.filter(c => row.original.villageIds.includes(c.villageId)).length;
        return <span className="font-bold text-slate-700">{count}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const st = statusColor(row.original.status);
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border" style={{ background: st.bg, color: st.color, borderColor: st.border }}>{row.original.status}</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedProgram(row.original)}
          className="rounded-xl text-xs font-semibold h-8 px-3"
          style={{ color: '#5DBCEB', background: 'rgba(93,188,235,0.08)' }}>
          <ExternalLink size={13} className="mr-1" /> Details
        </Button>
      ),
    },
  ];

  /* ── Program Detail Content ── */
  const renderDetail = (prog: Program) => {
    const pCoord = coordinators.find(c => c.id === prog.coordinatorId);
    const pVillages = villages.filter(v => prog.villageIds.includes(v.id));
    const pWorkers = workers.filter(w => prog.workerIds.includes(w.id));
    const pKids = children.filter(c => prog.villageIds.includes(c.villageId));
    const catColor = catColors[prog.category] || "#5DBCEB";
    const st = statusColor(prog.status);

    const start = new Date(prog.startDate).getTime();
    const end   = new Date(prog.endDate).getTime();
    const now   = new Date("2024-03-25").getTime();
    const progress = now >= end ? 100 : now <= start ? 0 : Math.round(((now - start) / (end - start)) * 100);

    return (
      <div className="flex flex-col max-h-[88vh] overflow-hidden rounded-3xl">
        {/* Unified Premium Hero Header */}
        <div
          className="shrink-0 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D2244 0%, #0B6CC4 45%, #5DBCEB 75%, #F28C28 100%)', padding: '1.5rem' }}
        >
          {/* Decorative rings */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ background: '#F9C642' }} />
          <div className="absolute right-24 -bottom-8 w-32 h-32 rounded-full opacity-10" style={{ background: '#F28C28' }} />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <ClipboardList size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Outfit,sans-serif' }}>{prog.name}</h2>
                <p className="text-white/70 text-xs mt-0.5">{prog.description || "No description provided."}</p>
              </div>
            </div>
            <span className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border mt-1"
              style={{ background: st.bg, color: st.color, borderColor: st.border }}>
              {prog.status}
            </span>
          </div>
        </div>

        {/* Unified Soft Sky-Blue Scrollable Body */}
        <div
          className="overflow-y-auto flex-1 p-5 space-y-4"
          style={{ background: '#F4F8FF', maxHeight: 'calc(88vh - 100px)' }}
        >
          {/* Progress bar */}
          <SectionCard title="Timeline Progress" icon={Calendar} color="#10b981">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-700">Timeline Progress</span>
              <span className="text-sm font-black text-emerald-600">{progress}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
              <span>Start: {new Date(prog.startDate).toLocaleDateString()}</span>
              <span>End: {new Date(prog.endDate).toLocaleDateString()}</span>
            </div>
          </SectionCard>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Coordinator card */}
            <SectionCard title="Assigned Coordinator" icon={Users} color="#5DBCEB">
              {pCoord ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-sky-100">
                    <AvatarImage src={pCoord.photo} />
                    <AvatarFallback className="font-bold">{pCoord.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-slate-800">{pCoord.name}</p>
                    <p className="text-xs text-slate-500">{pCoord.district} District • {pCoord.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No coordinator assigned</p>
              )}
            </SectionCard>

            {/* Category & dates */}
            <SectionCard title="Program Details" icon={ClipboardList} color="#F28C28">
              <div className="grid grid-cols-2 gap-3">
                <InfoPill label="Category" value={prog.category} />
                <InfoPill label="Status" value={prog.status} />
                <InfoPill label="Start Date" value={new Date(prog.startDate).toLocaleDateString()} />
                <InfoPill label="End Date" value={new Date(prog.endDate).toLocaleDateString()} />
              </div>
            </SectionCard>

            {/* Villages */}
            <SectionCard title={`Target Villages (${pVillages.length})`} icon={MapPin} color="#10b981">
              {pVillages.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No villages assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pVillages.map(v => (
                    <span key={v.id} className="px-2.5 py-1 rounded-xl text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.1)', color: '#065f46', border: '1px solid rgba(16,185,129,0.2)' }}>
                      {v.name}
                    </span>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Workers */}
            <SectionCard title={`Assigned Team (${pWorkers.length})`} icon={Activity} color="#F28C28">
              {pWorkers.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No workers assigned</p>
              ) : (
                <div className="space-y-2">
                  {pWorkers.map(w => (
                    <div key={w.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <Avatar className="h-8 w-8"><AvatarImage src={w.photo} /><AvatarFallback className="text-xs">{w.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{w.name}</p>
                        <p className="text-[11px] text-slate-500">{w.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pb-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800" style={{ fontFamily: 'Outfit,sans-serif' }}>
            Program Management
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track all NGO programs, campaigns, and drives.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(93,188,235,0.1)', color: '#0B6CC4' }}>
            {programs.length} Programs
          </div>
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: 'rgba(249,198,66,0.15)', color: '#92400e' }}>
            {programs.filter(p => p.status === "Ongoing").length} Ongoing
          </div>
        </div>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#065f46', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <Check size={18} className="text-emerald-600" />
            Program created successfully and added to the list!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 20px rgba(93,188,235,0.07)' }}>
        <DataTable columns={columns} data={programs} searchKey="name" searchPlaceholder="Search programs…" />
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={open => !open && setSelectedProgram(null)}>
        <DialogContent className="max-w-4xl p-0 border-none shadow-2xl overflow-hidden rounded-3xl">
          {selectedProgram && renderDetail(selectedProgram)}
        </DialogContent>
      </Dialog>

      {/* Create Program Modal */}
      <CreateProgramModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleSave}
        coordinators={coordinators}
      />

      {/* ── FAB Button ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setShowCreate(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-5 py-4 rounded-2xl text-white font-bold text-sm shadow-xl"
        style={{
          background: 'linear-gradient(135deg,#F28C28,#F9C642)',
          boxShadow: '0 8px 32px rgba(242,140,40,0.45), 0 2px 8px rgba(0,0,0,0.12)',
        }}
      >
        <Plus size={20} strokeWidth={2.5} />
        <span className="hidden sm:inline">New Program</span>
      </motion.button>
    </motion.div>
  );
}
