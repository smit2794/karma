import { Users, MapPin, AlertTriangle, ArrowRight, Activity, HandHeart, LogOut, Syringe, CalendarHeart, HeartPulse } from "lucide-react";
import { useAppContext } from "@/store";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapComponent, MapMarker } from "@/components/shared/MapComponent";
import "./CoordinatorDashboard.css";

export default function CoordinatorDashboard() {
  const { currentCoordinator, villages, workers, children, activities, setRole, setCurrentCoordinator } = useAppContext();
  
  if (!currentCoordinator) return null;

  const logout = () => {
    setRole(null);
    setCurrentCoordinator(null);
  };

  const myVillages = villages.filter(v => v.coordinatorId === currentCoordinator.id);
  const myWorkers = workers.filter(w => w.coordinatorId === currentCoordinator.id);
  const myChildren = children.filter(c => myVillages.find(v => v.id === c.villageId));
  const myActivities = activities.filter(a => a.coordinatorId === currentCoordinator.id);
  
  // Smart Alerts
  const highRiskChildren = myChildren.filter(c => c.riskLevel === "High");
  const nutritionAlerts = myChildren.filter(c => c.health.nutritionStatus !== "Healthy");
  const vaxAlerts = myChildren.filter(c => c.vaccinations.some(v => v.status === "Pending" || v.status === "Missed"));
  const upcomingVisits = myChildren.filter(c => c.visits.some(v => v.status === "Scheduled"));

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const mapMarkers: MapMarker[] = myVillages.map(v => {
    const vChildrenCount = myChildren.filter(c => c.villageId === v.id).length;
    return {
      id: v.id,
      lat: v.lat,
      lng: v.lng,
      title: v.name,
      popupContent: (
        <div className="font-sans text-sm">
          <p className="font-bold text-base">{v.name} Village</p>
          <p className="mb-2 text-muted-foreground">{v.district}</p>
          <p>Children: <span className="font-medium">{vChildrenCount}</span></p>
          <Badge className={`mt-2 ${v.riskLevel === 'High' ? 'k-bg-destructive-soft k-text-destructive' : v.riskLevel === 'Medium' ? 'k-bg-warning-soft k-text-warning' : 'k-bg-primary-soft k-text-primary'}`}>{v.riskLevel} Risk</Badge>
        </div>
      )
    };
  });

  return (
    <motion.div className="space-y-6 pb-12" variants={container} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Coordinator Dashboard</h2>
          <p className="k-text-muted">Welcome back, {currentCoordinator.name}. Here is your field operational overview.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-border shadow-sm">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentCoordinator.photo} />
            <AvatarFallback>{currentCoordinator.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{currentCoordinator.name}</p>
            <p className="text-xs k-text-muted mt-1">{currentCoordinator.district} District</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="ml-2 k-text-muted hover:text-red-500">
            <LogOut size={18} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <motion.div variants={item}>
          <StatCard title="My Children" value={myChildren.length} icon={<Users size={18} />} bgIcon={<Users />} color="primary" className="k-border-primary" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="My Villages" value={myVillages.length} icon={<MapPin size={18} />} bgIcon={<MapPin />} color="secondary" className="k-border-secondary" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="High Risk Alerts" value={highRiskChildren.length} icon={<AlertTriangle size={18} />} bgIcon={<AlertTriangle />} color="destructive" className={highRiskChildren.length > 0 ? "k-border-destructive k-bg-destructive-soft dark:bg-destructive/10" : ""} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Nutrition Alerts" value={nutritionAlerts.length} icon={<HeartPulse size={18} />} bgIcon={<HeartPulse />} color="accent" className={nutritionAlerts.length > 0 ? "k-border-accent k-bg-accent-soft dark:bg-accent/10" : ""} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Pending Vax" value={vaxAlerts.length} icon={<Syringe size={18} />} bgIcon={<Syringe />} color="warning" className={vaxAlerts.length > 0 ? "k-border-warning k-bg-warning-soft dark:bg-warning/10" : ""} />
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Action Items - Follow-ups */}
        <motion.div variants={item}>
          <Card className="h-full border-none shadow-md dark:bg-slate-900 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarHeart size={16} className="k-text-secondary" /> Upcoming Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {upcomingVisits.length > 0 ? (
                <div className="space-y-3">
                  {upcomingVisits.slice(0, 3).map(child => (
                    <div key={child.id} className="flex items-center justify-between p-2.5 rounded-xl k-bg-primary-soft k-border-primary">
                      <div>
                        <p className="text-sm font-medium">{child.name}</p>
                        <p className="text-xs k-text-muted">{myVillages.find(v=>v.id===child.villageId)?.name}</p>
                      </div>
                      <Badge variant="outline" className="k-text-primary k-border-primary">Scheduled</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm k-text-muted">No upcoming visits scheduled.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Items - Quick Actions */}
        <motion.div variants={item}>
          <Card className="h-full border-none shadow-md k-bg-primary k-text-primary-foreground dark:bg-primary/20 dark:text-primary dark:border-primary/30 flex flex-col justify-center">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-between dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/40 h-11">
                  Log New Visit <ArrowRight size={16} />
                </Button>
                <Button variant="secondary" className="w-full justify-between dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/40 h-11">
                  Update Vaccinations <ArrowRight size={16} />
                </Button>
                <Button variant="secondary" className="w-full justify-between dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/40 h-11">
                  Register Child <ArrowRight size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Workers Status */}
        <motion.div variants={item}>
          <Card className="h-full border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle>My Field Workers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myWorkers.length > 0 ? myWorkers.map(w => {
                  const wVillage = myVillages.find(v => v.id === w.villageId);
                  return (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={w.photo} />
                          <AvatarFallback>{w.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{w.name}</p>
                          <p className="text-xs k-text-muted">{wVillage?.name || "Unassigned"}</p>
                        </div>
                      </div>
                      <Badge className="k-bg-primary-soft k-text-primary k-bg-primary-hover">Active</Badge>
                    </div>
                  );
                }) : <p className="text-sm k-text-muted">No workers assigned.</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={item}>
          <Card className="h-full border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={18} className="k-text-primary" /> Coordinator Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myActivities.length > 0 ? myActivities.map(act => (
                  <div key={act.id} className="relative pl-4 border-l-2 k-border-primary pb-2">
                    <div className="absolute w-2 h-2 k-bg-primary rounded-full -left-[5px] top-1.5" />
                    <p className="text-sm font-medium">{act.title}</p>
                    <p className="text-xs k-text-muted mt-0.5">{act.description}</p>
                    <p className="text-[10px] k-text-muted mt-1 opacity-70">{new Date(act.date).toLocaleDateString()}</p>
                  </div>
                )) : (
                  <p className="text-sm k-text-muted">No recent activities found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

    </motion.div>
  );
}
