import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { useAppContext } from "@/store";
import { Worker } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./WorkersPage.css";

export default function WorkersPage() {
  const { workers, villages, coordinators, children } = useAppContext();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const getVillageName = (id: string) => villages.find(v => v.id === id)?.name || id;
  const getCoordinatorName = (id: string) => coordinators.find(c => c.id === id)?.name || id;

  const columns: ColumnDef<Worker>[] = [
    {
      accessorKey: "photo",
      header: "Photo",
      cell: ({ row }) => (
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={row.original.photo} />
          <AvatarFallback>{row.original.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="k-bg-secondary-soft k-text-secondary k-border-secondary">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "villageId",
      header: "Assigned Village",
      cell: ({ row }) => getVillageName(row.original.villageId),
    },
    {
      accessorKey: "coordinatorId",
      header: "Coordinator",
      cell: ({ row }) => getCoordinatorName(row.original.coordinatorId),
    },
    {
      id: "children",
      header: "Children Enrolled",
      cell: ({ row }) => children.filter(c => c.villageId === row.original.villageId).length,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={row.original.status === "Active" ? "k-bg-primary-soft k-text-primary k-bg-primary-hover" : "k-bg-secondary-soft k-text-secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedWorker(row.original)} className="k-text-primary hover:opacity-80">
          <ExternalLink size={16} className="mr-2" /> Profile
        </Button>
      ),
    },
  ];

  const getWorkerDetails = (worker: Worker) => {
    const wChildren = children.filter(c => c.villageId === worker.villageId);
    
    return (
      <div className="flex flex-col h-[80vh] md:h-auto overflow-hidden">
        {/* Profile Header */}
        <div className="k-bg-gradient-secondary-soft p-6 border-b border-border flex flex-col md:flex-row items-center md:items-start gap-6 relative">
          <Badge className="absolute top-4 right-4 k-bg-primary-soft k-text-primary k-bg-primary-hover">
            {worker.status}
          </Badge>
          <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-lg">
            <AvatarImage src={worker.photo} />
            <AvatarFallback className="text-2xl">{worker.name.substring(0,2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 mt-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">{worker.name}</h3>
            <p className="k-text-muted flex items-center justify-center md:justify-start gap-2 mt-1 font-medium">
              <Briefcase size={16} className="k-text-primary" /> {worker.category}
            </p>
            <p className="k-text-muted flex items-center justify-center md:justify-start gap-2 mt-1">
              <MapPin size={16} /> {getVillageName(worker.villageId)}
            </p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm">
              <span className="flex items-center gap-1.5"><Phone size={14} className="k-text-muted" /> {worker.phone}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} className="k-text-muted" /> {worker.email}</span>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-border rounded-xl p-5 bg-slate-50 dark:bg-slate-900/50">
              <h4 className="font-semibold text-lg border-b border-border pb-3 mb-4">Assigned Information</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="k-text-muted">Reporting Coordinator</p>
                  <p className="font-medium text-base">{getCoordinatorName(worker.coordinatorId)}</p>
                </div>
                <div>
                  <p className="k-text-muted">Primary Village</p>
                  <p className="font-medium text-base">{getVillageName(worker.villageId)}</p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-xl p-5 bg-slate-50 dark:bg-slate-900/50">
              <h4 className="font-semibold text-lg border-b border-border pb-3 mb-4">Children in Village ({wChildren.length})</h4>
              <div className="space-y-3">
                {wChildren.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarImage src={c.photo} /><AvatarFallback>{c.name.substring(0,1)}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.age} years old</p>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-white dark:bg-slate-800">{c.health.nutritionStatus}</Badge>
                  </div>
                ))}
                {wChildren.length === 0 && <p className="text-sm text-muted-foreground italic">No children enrolled in this village.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 k-page-bg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">On-ground Workers</h2>
        <p className="k-text-muted">Manage grassroots personnel responsible for daily village operations.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={workers} 
        searchKey="category" // Changed to category to allow filtering by role
        searchPlaceholder="Filter by category (e.g. Nutrition, Education)..." 
      />

      <Dialog open={!!selectedWorker} onOpenChange={(open) => !open && setSelectedWorker(null)}>
        <DialogContent className="max-w-3xl dark:bg-slate-950 p-0 overflow-hidden border-none shadow-2xl">
          {selectedWorker && getWorkerDetails(selectedWorker)}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
