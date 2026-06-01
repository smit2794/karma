import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Calendar, Users, MapPin, ClipboardList, Activity } from "lucide-react";
import { useAppContext } from "@/store";
import { Program } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./ProgramsPage.css";

export default function ProgramsPage() {
  const { programs, coordinators, villages, workers, children } = useAppContext();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const getCoordinatorName = (id: string) => coordinators.find(c => c.id === id)?.name || id;

  const columns: ColumnDef<Program>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Program Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium k-text-primary">{row.original.name}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const cat = row.original.category;
        return <Badge variant="outline" className="k-bg-secondary-soft k-text-secondary k-border-secondary">{cat}</Badge>;
      }
    },
    {
      accessorKey: "coordinatorId",
      header: "Coordinator",
      cell: ({ row }) => getCoordinatorName(row.original.coordinatorId),
    },
    {
      id: "villages",
      header: "Villages",
      cell: ({ row }) => row.original.villageIds.length,
    },
    {
      id: "childrenCovered",
      header: "Children Covered",
      cell: ({ row }) => {
        // Sum children in assigned villages
        const count = children.filter(c => row.original.villageIds.includes(c.villageId)).length;
        return count;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge className={s === "Ongoing" ? "k-bg-warning-soft k-text-warning k-bg-warning-hover" : 
                             s === "Completed" ? "k-bg-primary-soft k-text-primary k-bg-primary-hover" : "k-bg-accent-soft k-text-accent k-bg-accent-hover"}>
            {s}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedProgram(row.original)} className="k-text-primary hover:opacity-80">
          <ExternalLink size={16} className="mr-2" /> Details
        </Button>
      ),
    },
  ];

  const getProgramDetails = (program: Program) => {
    const pCoordinator = coordinators.find(c => c.id === program.coordinatorId);
    const pVillages = villages.filter(v => program.villageIds.includes(v.id));
    const pWorkers = workers.filter(w => program.workerIds.includes(w.id));
    const pChildrenCount = children.filter(c => program.villageIds.includes(c.villageId)).length;
    
    // Calculate progress based on dates (Mock logic)
    const start = new Date(program.startDate).getTime();
    const end = new Date(program.endDate).getTime();
    const now = new Date("2024-03-25").getTime(); // Mock current date
    let progress = 0;
    if (now >= end) progress = 100;
    else if (now <= start) progress = 0;
    else progress = Math.round(((now - start) / (end - start)) * 100);

    return (
      <div className="flex flex-col h-[85vh] md:h-auto overflow-hidden">
        {/* Header */}
        <div className="k-bg-primary-soft p-6 border-b border-border relative shrink-0">
          <Badge className={`absolute top-6 right-6 ${program.status === 'Ongoing' ? 'k-bg-warning-soft k-text-warning k-bg-warning-hover' : program.status === 'Planned' ? 'k-bg-accent-soft k-text-accent k-bg-accent-hover' : 'k-bg-primary-soft k-text-primary k-bg-primary-hover'}`}>
             {program.status}
          </Badge>
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="k-text-primary h-8 w-8" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{program.name}</h2>
          </div>
          <p className="k-text-muted mb-4 max-w-2xl">{program.description}</p>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-md shadow-sm border border-border">
              <Calendar size={16} className="k-text-muted" /> {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5 k-bg-secondary-soft k-text-secondary px-3 py-1.5 rounded-md border k-border-secondary">
              <Activity size={16} /> {program.category}
            </span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center text-center">
              <MapPin size={24} className="k-text-primary mb-2" />
              <p className="text-2xl font-bold">{pVillages.length}</p>
              <p className="text-xs k-text-muted">Target Villages</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center text-center">
              <Users size={24} className="k-text-accent mb-2" />
              <p className="text-2xl font-bold">{pChildrenCount}</p>
              <p className="text-xs k-text-muted">Children Covered</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center text-center col-span-2">
              <div className="w-full mb-2 flex justify-between text-sm font-medium">
                <span>Timeline Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5">
                <div className="k-bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs k-text-muted mt-2">Based on start and end dates.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Coordinator */}
              <div className="border border-border rounded-xl p-5 bg-white dark:bg-slate-900">
                <h4 className="font-semibold text-lg border-b border-border pb-3 mb-4">Project Coordinator</h4>
                {pCoordinator ? (
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12"><AvatarImage src={pCoordinator.photo} /><AvatarFallback>{pCoordinator.name[0]}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-bold">{pCoordinator.name}</p>
                      <p className="text-sm text-muted-foreground">{pCoordinator.district} District</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No coordinator assigned.</p>
                )}
              </div>

              {/* Villages */}
              <div className="border border-border rounded-xl p-5 bg-white dark:bg-slate-900">
                <h4 className="font-semibold text-lg border-b border-border pb-3 mb-4">Target Villages</h4>
                <div className="flex flex-wrap gap-2">
                  {pVillages.map(v => (
                    <Badge key={v.id} variant="secondary" className="bg-slate-100">{v.name}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Workers */}
            <div className="border border-border rounded-xl p-5 bg-white dark:bg-slate-900 h-full">
              <h4 className="font-semibold text-lg border-b border-border pb-3 mb-4">Assigned Team ({pWorkers.length})</h4>
              <div className="space-y-4">
                {pWorkers.map(w => (
                  <div key={w.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarImage src={w.photo} /><AvatarFallback>{w.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium text-sm">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {pWorkers.length === 0 && <p className="text-sm text-muted-foreground italic">No workers assigned.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-8 k-page-bg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Program Management</h2>
        <p className="k-text-muted">Manage and track NGO projects, campaigns, and drives.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={programs} 
        searchKey="name" 
        searchPlaceholder="Search programs..." 
      />

      <Dialog open={!!selectedProgram} onOpenChange={(open) => !open && setSelectedProgram(null)}>
        <DialogContent className="max-w-4xl dark:bg-slate-950 p-0 overflow-hidden border-none shadow-2xl">
          {selectedProgram && getProgramDetails(selectedProgram)}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
