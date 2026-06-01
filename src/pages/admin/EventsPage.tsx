import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Calendar, MapPin, Users, Image as ImageIcon, Video } from "lucide-react";
import { useAppContext } from "@/store";
import { NgoEvent } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./EventsPage.css";

export default function EventsPage() {
  const { events, coordinators, workers, villages } = useAppContext();
  const [selectedEvent, setSelectedEvent] = useState<NgoEvent | null>(null);

  const getCoordinatorName = (id: string) => coordinators.find(c => c.id === id)?.name || id;

  const columns: ColumnDef<NgoEvent>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Event Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.original.name}</span>,
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "coordinatorId",
      header: "Coordinator",
      cell: ({ row }) => getCoordinatorName(row.original.coordinatorId),
    },
    {
      id: "workers",
      header: "Workers",
      cell: ({ row }) => row.original.workerIds.length,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge className={s === "Completed" ? "k-bg-primary-soft k-text-primary k-bg-primary-hover" : 
                             s === "Ongoing" ? "k-bg-warning-soft k-text-warning k-bg-warning-hover" : "k-bg-secondary-soft k-text-secondary k-bg-secondary-hover"}>
            {s}
          </Badge>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(row.original)} className="k-text-primary hover:opacity-80">
          <ExternalLink size={16} className="mr-2" /> View
        </Button>
      ),
    },
  ];

  const getEventDetails = (event: NgoEvent) => {
    const eCoordinator = coordinators.find(c => c.id === event.coordinatorId);
    const eVillage = villages.find(v => v.id === event.villageId);
    const eWorkers = workers.filter(w => event.workerIds.includes(w.id));
    
    return (
      <div className="flex flex-col h-[85vh] md:h-[80vh] overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Banner */}
        <div className="h-40 k-bg-gradient-secondary-primary relative shrink-0">
          {event.photos.length > 0 && (
            <img src={event.photos[0]} alt="Event Banner" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
          )}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <Badge className={`w-fit mb-2 ${event.status === 'Completed' ? 'k-bg-primary' : 'k-bg-warning-soft k-text-warning'}`}>{event.status}</Badge>
            <h2 className="text-3xl font-bold text-white shadow-sm">{event.name}</h2>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* Quick Info & Description */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">About Event</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{event.description}</p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <span className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-border px-3 py-1.5 rounded-md text-sm shadow-sm">
                  <Calendar size={16} className="k-text-primary" /> {new Date(event.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                </span>
                <span className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-border px-3 py-1.5 rounded-md text-sm shadow-sm">
                  <Users size={16} className="k-text-accent" /> {event.childrenAttended} Children Attended
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2">Area Information</h3>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-border shadow-sm space-y-3 text-sm">
                <div>
                  <p className="k-text-muted">Location</p>
                  <p className="font-medium flex items-center gap-1"><MapPin size={14} className="k-text-primary" /> {event.location}</p>
                </div>
                <div>
                  <p className="k-text-muted">Village & District</p>
                  <p className="font-medium">{eVillage?.name}, {event.district}</p>
                </div>
                {eVillage && (
                  <div>
                    <p className="k-text-muted">Area Risk Level</p>
                    <Badge variant="outline" className={eVillage.riskLevel === "High" ? "k-text-destructive k-border-destructive" : eVillage.riskLevel === "Medium" ? "k-text-warning k-border-warning" : "k-text-primary k-border-primary"}>
                      {eVillage.riskLevel}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Teams */}
          <div>
            <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Participation</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Coordinator */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-border">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Lead Coordinator</p>
                {eCoordinator ? (
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12"><AvatarImage src={eCoordinator.photo} /><AvatarFallback>{eCoordinator.name[0]}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-bold">{eCoordinator.name}</p>
                      <p className="text-sm text-muted-foreground">{eCoordinator.district}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No coordinator assigned.</p>
                )}
              </div>
              
              {/* Workers */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-border">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Participating Workers ({eWorkers.length})</p>
                <div className="space-y-3">
                  {eWorkers.map(w => (
                    <div key={w.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarImage src={w.photo} /><AvatarFallback>{w.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium text-sm">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.category}</p>
                      </div>
                    </div>
                  ))}
                  {eWorkers.length === 0 && <p className="text-sm text-muted-foreground italic">No workers participated.</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          <div>
            <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="k-text-primary" /> Event Media Gallery
            </h3>
            {event.photos.length === 0 && event.videos.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-dashed border-border rounded-xl p-8 text-center">
                <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-muted-foreground">No photos or videos uploaded for this event.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.photos.map((photo, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border border-border shadow-sm group relative">
                    <img src={photo} alt={`Event photo ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
                {event.videos.map((video, i) => (
                  <div key={`v-${i}`} className="aspect-video rounded-xl overflow-hidden border border-border shadow-sm relative group bg-slate-800 flex items-center justify-center">
                    <img src={video} alt={`Video thumbnail`} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:bg-white/40 transition-colors">
                        <Video size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-8 k-page-bg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Event Management</h2>
        <p className="k-text-muted">Browse and manage NGO events, health camps, and awareness drives.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={events} 
        searchKey="name" 
        searchPlaceholder="Search events..." 
      />

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl dark:bg-slate-950 p-0 overflow-hidden border-none shadow-2xl">
          {selectedEvent && getEventDetails(selectedEvent)}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
