import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Activity, Syringe, CalendarHeart, HandHeart, Info, ActivitySquare } from "lucide-react";
import { useAppContext } from "@/store";
import { Child } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import "./ChildrenPage.css";

export default function ChildrenPage() {
  const { children, villages } = useAppContext();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const getVillageName = (id: string) => villages.find(v => v.id === id)?.name || id;

  const columns: ColumnDef<Child>[] = [
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
    { accessorKey: "age", header: "Age" },
    {
      accessorKey: "villageId",
      header: "Village",
      cell: ({ row }) => getVillageName(row.original.villageId),
    },
    {
      id: "nutrition",
      header: "Nutrition Status",
      cell: ({ row }) => {
        const s = row.original.health.nutritionStatus;
        return (
          <Badge className={s === "Healthy" ? "k-bg-primary-soft k-text-primary k-bg-primary-hover" : s === "Malnourished" ? "k-bg-warning-soft k-text-warning k-bg-warning-hover" : "k-bg-destructive-soft k-text-destructive k-bg-destructive-hover"}>
            {s}
          </Badge>
        );
      },
    },
    {
      accessorKey: "riskLevel",
      header: "Risk Level",
      cell: ({ row }) => {
        const r = row.original.riskLevel;
        return (
          <Badge variant="outline" className={r === "Low" ? "k-text-primary k-border-primary" : r === "Medium" ? "k-text-warning k-border-warning" : "k-text-destructive k-border-destructive"}>
            {r} Risk
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedChild(row.original)} className="k-text-primary hover:opacity-80">
          <ExternalLink size={16} className="mr-2" /> Profile
        </Button>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 k-page-bg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Child Management</h2>
        <p className="k-text-muted">Comprehensive tracking of child health, nutrition, vaccinations, and milestones.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={children} 
        searchKey="name" 
        searchPlaceholder="Search by child name..." 
      />

      <Dialog open={!!selectedChild} onOpenChange={(open) => !open && setSelectedChild(null)}>
        <DialogContent className="max-w-4xl dark:bg-slate-950 p-0 overflow-hidden border-none shadow-2xl h-[90vh] flex flex-col">
          {selectedChild && (
            <>
              {/* Header */}
              <div className="k-bg-primary-soft p-6 border-b border-border flex items-start gap-6 shrink-0 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                   <Badge variant="outline" className={selectedChild.riskLevel === "Low" ? "k-text-primary k-border-primary" : selectedChild.riskLevel === "Medium" ? "k-text-warning k-border-warning" : "k-text-destructive k-border-destructive"}>
                     {selectedChild.riskLevel} Risk
                   </Badge>
                   <Badge className={selectedChild.health.nutritionStatus === "Healthy" ? "k-bg-primary" : selectedChild.health.nutritionStatus === "Malnourished" ? "k-bg-warning k-text-warning" : "k-bg-destructive"}>
                     {selectedChild.health.nutritionStatus}
                   </Badge>
                </div>
                <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-lg">
                  <AvatarImage src={selectedChild.photo} />
                  <AvatarFallback className="text-2xl">{selectedChild.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 mt-1">
                  <h3 className="text-2xl font-bold">{selectedChild.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    {selectedChild.age} years old • {selectedChild.gender} • {getVillageName(selectedChild.villageId)}
                  </p>
                  <div className="mt-3 text-sm flex gap-4 text-slate-600 dark:text-slate-400">
                    <span>Aadhaar: {selectedChild.aadhaar}</span>
                    <span>Contact: {selectedChild.phone}</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent space-x-6 flex-wrap">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"><Info className="h-4 w-4 mr-2"/> Overview & Family</TabsTrigger>
                    <TabsTrigger value="health" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"><Activity className="h-4 w-4 mr-2"/> Health & Nutrition</TabsTrigger>
                    <TabsTrigger value="vaccinations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"><Syringe className="h-4 w-4 mr-2"/> Vaccinations</TabsTrigger>
                    <TabsTrigger value="growth" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"><ActivitySquare className="h-4 w-4 mr-2"/> Growth Milestones</TabsTrigger>
                    <TabsTrigger value="interventions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"><HandHeart className="h-4 w-4 mr-2"/> Interventions</TabsTrigger>
                    <TabsTrigger value="visits" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"><CalendarHeart className="h-4 w-4 mr-2"/> Visits & Follow-ups</TabsTrigger>
                  </TabsList>
                  
                  {/* OVERVIEW TAB */}
                  <TabsContent value="overview" className="mt-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50">
                         <h4 className="font-semibold mb-4 k-text-primary">Registration Details</h4>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="k-text-muted text-xs">Date of Birth</p><p className="font-medium">{new Date(selectedChild.dob).toLocaleDateString()}</p></div>
                            <div><p className="k-text-muted text-xs">Aadhaar</p><p className="font-medium">{selectedChild.aadhaar}</p></div>
                            <div className="col-span-2"><p className="k-text-muted text-xs">Address</p><p className="font-medium">{selectedChild.address}</p></div>
                         </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-sm">
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Father's Info</h4>
                          <p className="font-medium">{selectedChild.fatherName}</p>
                          <p className="text-xs text-muted-foreground mt-1">Aadhaar: {selectedChild.fatherAadhaar}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-sm">
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Mother's Info</h4>
                          <p className="font-medium">{selectedChild.motherName}</p>
                          <p className="text-xs text-muted-foreground mt-1">Aadhaar: {selectedChild.motherAadhaar}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* HEALTH TAB */}
                  <TabsContent value="health" className="mt-6 space-y-6">
                     <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl k-bg-primary-soft k-text-primary text-center">
                          <p className="text-sm opacity-80 mb-1">Height</p>
                          <p className="text-3xl font-bold">{selectedChild.health.height} <span className="text-base font-normal">cm</span></p>
                        </div>
                        <div className="p-4 rounded-xl k-bg-accent-soft k-text-accent text-center">
                          <p className="text-sm opacity-80 mb-1">Weight</p>
                          <p className="text-3xl font-bold">{selectedChild.health.weight} <span className="text-base font-normal">kg</span></p>
                        </div>
                        <div className="p-4 rounded-xl k-bg-secondary-soft k-text-secondary text-center">
                          <p className="text-sm opacity-80 mb-1">MUAC</p>
                          <p className="text-3xl font-bold">{selectedChild.health.muac} <span className="text-base font-normal">cm</span></p>
                        </div>
                     </div>
                     
                     <div className="h-[300px] border border-border rounded-xl p-4 mt-6">
                        <h4 className="font-semibold mb-4 text-sm">Growth Trend History</h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedChild.healthHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, {month:'short', year:'numeric'})} fontSize={12} stroke="#888" />
                            <YAxis yAxisId="left" stroke="#888" fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} />
                            <RechartsTooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="height" name="Height (cm)" stroke="#0066CC" strokeWidth={2} />
                            <Line yAxisId="right" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#F57C00" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </TabsContent>

                  {/* VACCINATIONS TAB */}
                  <TabsContent value="vaccinations" className="mt-6">
                     <div className="space-y-4 max-w-2xl">
                        {["BCG", "OPV", "DPT", "Measles", "Polio"].map(vaxName => {
                          const record = selectedChild.vaccinations.find(v => v.name === vaxName);
                          const status = record?.status || "Pending";
                          return (
                            <div key={vaxName} className="flex items-center justify-between p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50">
                               <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${status === "Completed" ? "k-bg-primary-soft k-text-primary" : status === "Missed" ? "k-bg-destructive-soft k-text-destructive" : "bg-slate-200 text-slate-500"}`}>
                                    <Syringe size={16} />
                                  </div>
                                  <div>
                                    <p className="font-semibold">{vaxName}</p>
                                    <p className="text-xs k-text-muted">{record?.date ? `Administered on ${new Date(record.date).toLocaleDateString()}` : 'No date recorded'}</p>
                                  </div>
                               </div>
                               <Badge className={status === "Completed" ? "k-bg-primary" : status === "Missed" ? "k-bg-destructive" : "k-bg-secondary"}>
                                 {status}
                               </Badge>
                            </div>
                          );
                        })}
                     </div>
                  </TabsContent>

                  {/* GROWTH TAB */}
                  <TabsContent value="growth" className="mt-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {["Walking", "Speaking", "Learning Skills", "Social Skills"].map(milestone => {
                          const record = selectedChild.milestones.find(m => m.name === milestone);
                          const status = record?.status || "Pending";
                          return (
                            <div key={milestone} className="p-4 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between h-32">
                               <p className="font-semibold text-lg">{milestone}</p>
                               <div>
                                 <Badge className={`mb-2 ${status === "Achieved" ? "k-bg-primary" : status === "Delayed" ? "k-bg-warning k-text-warning" : "k-bg-secondary"}`}>
                                   {status}
                                 </Badge>
                                 <p className="text-xs k-text-muted">{record?.date ? `Recorded on ${new Date(record.date).toLocaleDateString()}` : 'Awaiting observation'}</p>
                               </div>
                            </div>
                          );
                        })}
                     </div>
                  </TabsContent>

                  {/* INTERVENTIONS TAB */}
                  <TabsContent value="interventions" className="mt-6">
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {selectedChild.interventions.length > 0 ? selectedChild.interventions.map((int, idx) => (
                        <div key={int.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                           <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-accent text-accent-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                             <HandHeart size={16} />
                           </div>
                           <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-sm">
                             <div className="flex justify-between items-center mb-1">
                               <Badge variant="outline" className="k-text-accent k-border-accent">{int.type}</Badge>
                               <span className="text-xs k-text-muted">{new Date(int.date).toLocaleDateString()}</span>
                             </div>
                             <p className="font-medium text-sm mt-2">{int.description}</p>
                             {int.result && <p className="text-xs text-slate-500 mt-2 italic">Outcome: {int.result}</p>}
                           </div>
                        </div>
                      )) : <p className="text-center text-muted-foreground py-8">No specific nutritional interventions recorded.</p>}
                    </div>
                  </TabsContent>

                  {/* VISITS TAB */}
                  <TabsContent value="visits" className="mt-6">
                     <div className="space-y-4 max-w-3xl mx-auto">
                        {selectedChild.visits.length > 0 ? selectedChild.visits.map(visit => (
                          <div key={visit.id} className="p-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 flex gap-4">
                             <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-3 rounded-lg border border-border min-w-20 text-center">
                                <span className="text-xs text-muted-foreground uppercase">{new Date(visit.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-xl font-bold">{new Date(visit.date).getDate()}</span>
                             </div>
                              <div className="flex-1 pt-1">
                                <div className="flex justify-between items-start">
                                  <p className="font-semibold text-lg">{visit.type}</p>
                                  <Badge className={visit.status === "Completed" ? "k-bg-primary" : visit.status === "Missed" ? "k-bg-destructive" : "k-bg-secondary"}>{visit.status}</Badge>
                                </div>
                                <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">{visit.observation || "No observations recorded."}</p>
                             </div>
                          </div>
                        )) : <p className="text-center k-text-muted py-8">No visits scheduled or recorded.</p>}
                     </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
