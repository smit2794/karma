import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Mail, Phone, MapPin, HandHeart, History, CalendarDays } from "lucide-react";
import { useAppContext } from "@/store";
import { Coordinator } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./CoordinatorsPage.css";

export default function CoordinatorsPage() {
  const { coordinators, workers, villages, children } = useAppContext();
  const [selectedCoordinator, setSelectedCoordinator] = useState<Coordinator | null>(null);

  const columns: ColumnDef<Coordinator>[] = [
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
      accessorKey: "district",
      header: "Assigned District",
    },
    {
      id: "villages",
      header: "Villages Covered",
      cell: ({ row }) => villages.filter(v => v.coordinatorId === row.original.id).length,
    },
    {
      id: "workers",
      header: "Team Size",
      cell: ({ row }) => workers.filter(w => w.coordinatorId === row.original.id).length,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={row.original.status === "Active" ? "k-bg-primary-soft k-text-primary k-bg-primary-hover" : "k-bg-slate-200 k-text-slate-500"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedCoordinator(row.original)} className="k-text-primary hover:opacity-80">
          <ExternalLink size={16} className="mr-2" /> Profile
        </Button>
      ),
    },
  ];

  const getCoordinatorDetails = (coordinator: Coordinator) => {
    const team = workers.filter(w => w.coordinatorId === coordinator.id);
    const assignedVillages = villages.filter(v => v.coordinatorId === coordinator.id);
    const assignedChildren = children.filter(c => assignedVillages.find(v => v.id === c.villageId));
    
    return (
      <div className="flex flex-col h-[85vh] md:h-auto overflow-hidden">
        {/* Profile Header */}
        <div className="k-bg-accent-soft p-6 border-b border-border flex flex-col md:flex-row items-center md:items-start gap-6 relative shrink-0">
          <Badge className="absolute top-4 right-4 k-bg-primary-soft k-text-primary k-bg-primary-hover">
            {coordinator.status}
          </Badge>
          <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-lg">
            <AvatarImage src={coordinator.photo} />
            <AvatarFallback className="text-2xl">{coordinator.name.substring(0,2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 mt-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">{coordinator.name}</h3>
            <p className="k-text-muted flex items-center justify-center md:justify-start gap-2 mt-1">
              <MapPin size={16} /> {coordinator.district} District Field Coordinator
            </p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm">
              <span className="flex items-center gap-1.5"><Phone size={14} className="k-text-muted" /> {coordinator.phone}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} className="k-text-muted" /> {coordinator.email}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start rounded-none border-b border-border px-6 h-auto py-0 bg-transparent shrink-0">
            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">Overview</TabsTrigger>
            <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3">History</TabsTrigger>
          </TabsList>
          
          <div className="overflow-y-auto flex-1 p-6">
            <TabsContent value="overview" className="m-0 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 text-center">
                  <p className="text-2xl font-bold k-text-primary">{assignedVillages.length}</p>
                  <p className="text-xs k-text-muted mt-1">Villages</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 text-center">
                  <p className="text-2xl font-bold k-text-accent">{team.length}</p>
                  <p className="text-xs k-text-muted mt-1">Field Workers</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 text-center col-span-2">
                  <p className="text-2xl font-bold k-text-secondary">{assignedChildren.length}</p>
                  <p className="text-xs k-text-muted mt-1">Total Children Monitored</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">
                  <HandHeart className="text-primary" size={20} /> Team Structure
                </h4>
                <div className="pl-2 border-l-2 border-border ml-4 space-y-6">
                  {team.map(w => {
                    const wVillage = assignedVillages.find(v => v.id === w.villageId);
                    const wChildren = children.filter(c => c.villageId === w.villageId);
                    return (
                      <div key={w.id} className="relative pl-6">
                        <div className="absolute w-4 h-[2px] bg-border left-0 top-6" />
                        <div className="p-4 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={w.photo} />
                              <AvatarFallback>{w.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{w.name}</p>
                              <p className="text-xs k-text-muted flex items-center gap-1"><MapPin size={12} /> {wVillage?.name}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-slate-100 k-text-slate-500">{wChildren.length} Children</Badge>
                        </div>
                      </div>
                    );
                  })}
                  {team.length === 0 && <p className="text-sm text-muted-foreground italic pl-4">No workers assigned to this coordinator.</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="m-0 space-y-6">
              <h4 className="font-semibold text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">
                <History className="text-primary" size={20} /> Performance & Activity Timeline
              </h4>
              <div className="pl-4 border-l-2 border-primary/20 space-y-8 mt-4">
                {coordinator.history.length > 0 ? coordinator.history.map((h, i) => (
                  <div key={h.id} className="relative pl-6">
                    <div className="absolute -left-[29px] top-1 h-4 w-4 rounded-full border-4 border-white dark:border-slate-950 bg-primary shadow-sm" />
                    <div className="bg-white dark:bg-slate-900 border border-border p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <CalendarDays size={14} /> {new Date(h.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </div>
                      <h5 className="font-bold text-base mb-1">{h.title}</h5>
                      <p className="text-sm text-muted-foreground">{h.description}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center p-8 border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">No historical data available for this coordinator.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 k-page-bg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Field Coordinators</h2>
        <p className="k-text-muted">Manage regional coordinators and their field worker teams.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={coordinators} 
        searchKey="name" 
        searchPlaceholder="Search coordinators..." 
      />

      <Dialog open={!!selectedCoordinator} onOpenChange={(open) => !open && setSelectedCoordinator(null)}>
        <DialogContent className="max-w-3xl dark:bg-slate-950 p-0 overflow-hidden border-none shadow-2xl">
          {selectedCoordinator && getCoordinatorDetails(selectedCoordinator)}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
