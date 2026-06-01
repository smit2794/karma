import { Users, MapPin, AlertTriangle, HeartPulse, ShieldCheck, Box, Calendar, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/store";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Legend 
} from "recharts";
import { motion, Variants } from "framer-motion";
import "./AdminDashboard.css";

const COLORS = {
  Primary: "#0B6CC4",     // Karma Primary Blue
  Secondary: "#5DBCEB",   // Karma Light Blue
  Accent: "#F28C28",      // Karma Orange
  Destructive: "#D92B2B", // Karma Alert Red
  Success: "#10b981",     // Green (keep default success)
  Warning: "#F9C642",     // Karma Golden Yellow
  Muted: "#94a3b8"        // Slate
};

export default function AdminDashboard() {
  const { 
    children, coordinators, workers, foodDistribution, 
    villages, programs, events, inventory 
  } = useAppContext();

  // 12. NGO Impact Summary (KPIs)
  const totalChildren = children.length;
  const totalVillages = villages.length;
  const totalFoodDist = foodDistribution.reduce((acc, f) => acc + f.quantity, 0);
  const totalWorkers = workers.length;

  // 1. Children by District (Bar Chart)
  const distMap: Record<string, number> = {};
  children.forEach(c => {
    const dist = villages.find(v => v.id === c.villageId)?.district || "Unknown";
    distMap[dist] = (distMap[dist] || 0) + 1;
  });
  const childrenByDistrict = Object.keys(distMap).map(k => ({ name: k, count: distMap[k] }));

  // 2. Nutrition Status Distribution (Pie Chart)
  const nutritionData = [
    { name: "Healthy", value: children.filter(c => c.health.nutritionStatus === "Healthy").length, color: COLORS.Success },
    { name: "Malnourished", value: children.filter(c => c.health.nutritionStatus === "Malnourished").length, color: COLORS.Warning },
    { name: "Severely Malnourished", value: children.filter(c => c.health.nutritionStatus === "Severely Malnourished").length, color: COLORS.Destructive },
  ];

  // 3. Vaccination Status (Donut Chart)
  let vaxCompleted = 0; let vaxPending = 0; let vaxMissed = 0;
  children.forEach(c => {
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

  // 4. Food Distribution Trend (Line Chart)
  // Mock grouping by month for display purposes (using static dates from mockData)
  const foodTrendMap: Record<string, number> = {};
  foodDistribution.forEach(f => {
    const d = new Date(f.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    foodTrendMap[d] = (foodTrendMap[d] || 0) + f.quantity;
  });
  const foodTrendData = Object.keys(foodTrendMap).sort().map(k => ({ date: k, quantity: foodTrendMap[k] }));

  // 5. Program Progress Overview (Bar Chart)
  const progData = [
    { name: "Completed", value: programs.filter(p => p.status === "Completed").length, fill: COLORS.Success },
    { name: "Ongoing", value: programs.filter(p => p.status === "Ongoing").length, fill: COLORS.Primary },
    { name: "Planned", value: programs.filter(p => p.status === "Planned").length, fill: COLORS.Warning },
  ];

  // 6. Coordinator Performance Ranking (Horizontal Bar)
  const coordData = coordinators.map(c => {
    const kids = children.filter(ch => ch.coordinatorId === c.id).length;
    return { name: c.name.split(" ")[0], children: kids };
  }).sort((a,b) => b.children - a.children);

  // 7. Worker Category Distribution (Pie Chart)
  const catMap: Record<string, number> = {};
  workers.forEach(w => {
    // Simplify names for chart fitting
    const n = w.category.replace(" Worker", "").replace(" & Child Development", " Dev");
    catMap[n] = (catMap[n] || 0) + 1;
  });
  const workerCatData = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));
  const workerColors = [COLORS.Primary, COLORS.Accent, COLORS.Secondary, COLORS.Warning, COLORS.Destructive, COLORS.Success];

  // 8. Village Risk Level Distribution (Donut Chart)
  const villageRiskData = [
    { name: "Low", value: villages.filter(v => v.riskLevel === "Low").length, color: COLORS.Success },
    { name: "Medium", value: villages.filter(v => v.riskLevel === "Medium").length, color: COLORS.Warning },
    { name: "High", value: villages.filter(v => v.riskLevel === "High").length, color: COLORS.Destructive },
  ];

  // 9. Follow-Up Completion Rate (Gauge Chart)
  let totalVisits = 0; let completedVisits = 0;
  children.forEach(c => {
    c.visits.forEach(v => {
      totalVisits++;
      if(v.status === "Completed") completedVisits++;
    });
  });
  const visitRate = totalVisits === 0 ? 0 : Math.round((completedVisits/totalVisits)*100);
  const visitGaugeData = [
    { name: "Completed", value: visitRate, color: COLORS.Primary },
    { name: "Remaining", value: 100 - visitRate, color: COLORS.Muted }
  ];

  // 10. Inventory Health (Gauge Chart)
  const healthyInv = inventory.filter(i => i.status === "In Stock").length;
  const invRate = inventory.length === 0 ? 0 : Math.round((healthyInv/inventory.length)*100);
  const invGaugeData = [
    { name: "Healthy", value: invRate, color: COLORS.Success },
    { name: "Low/Out", value: 100 - invRate, color: COLORS.Destructive }
  ];

  // 11. Event Participation Trend (Line Chart)
  const eventTrendMap: Record<string, number> = {};
  events.forEach(e => {
    const d = new Date(e.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    eventTrendMap[d] = (eventTrendMap[d] || 0) + e.childrenAttended;
  });
  const eventTrendData = Object.keys(eventTrendMap).sort().map(k => ({ date: k, attendees: eventTrendMap[k] }));


  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div className="space-y-6 pb-12 k-page-bg" variants={container} initial="hidden" animate="show">
      <div>
        <h2 className="text-2xl font-bold tracking-tight k-text-primary">NGO Analytics & Insights</h2>
        <p className="k-text-muted">Comprehensive overview of Karma Foundation's operational impact.</p>
      </div>

      {/* 12. NGO Impact Summary (Large KPI Cards) */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <StatCard 
            title="Children Monitored" 
            value={totalChildren} 
            icon={<Users size={20} />} 
            bgIcon={<Users />}
            color="primary"
            className="border-primary/20 shadow-sm" 
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Villages Reached" 
            value={totalVillages} 
            icon={<MapPin size={20} />} 
            bgIcon={<MapPin />}
            color="indigo"
            className="border-indigo-200/50 shadow-sm" 
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Food Distributed" 
            value={totalFoodDist} 
            icon={<Box size={20} />} 
            bgIcon={<Box />}
            color="green"
            className="border-emerald-200/50 shadow-sm" 
            description="Units"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard 
            title="Field Workers" 
            value={totalWorkers} 
            icon={<ShieldCheck size={20} />} 
            bgIcon={<ShieldCheck />}
            color="orange"
            className="border-orange-200/50 shadow-sm" 
          />
        </motion.div>
      </div>

      {/* Grid of 11 Charts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        
        {/* SVG Gradients for Charts */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.Primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.Primary} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorAccent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.Accent} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={COLORS.Accent} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.Success} stopOpacity={0.5}/>
              <stop offset="95%" stopColor={COLORS.Success} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
        </svg>

        {/* 4. Food Distribution Trend (LARGE WIDE) */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-4">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">4. Food Dist. Trend (Units)</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={foodTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dx={-10} />
                  <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }} />
                  <Area type="monotone" dataKey="quantity" stroke={COLORS.Success} strokeWidth={4} fill="url(#colorSuccess)" activeDot={{r: 8, strokeWidth: 0}} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 1. Children by District (MEDIUM WIDE) */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">1. Children by District</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={childrenByDistrict} margin={{ left: -20 }}>
                  <XAxis dataKey="name" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="count" fill="url(#colorPrimary)" radius={[8,8,8,8]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. Nutrition Status (SMALL SQUARE) */}
        <motion.div variants={item} className="lg:col-span-1">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">2. Nutrition Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={nutritionData} cx="50%" cy="50%" outerRadius={85} dataKey="value" stroke="white" strokeWidth={3}>
                    {nutritionData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Vaccination Status (SMALL SQUARE DONUT) */}
        <motion.div variants={item} className="lg:col-span-1">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">3. Vaccination Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={vaxData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="white" strokeWidth={2} paddingAngle={2}>
                    {vaxData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5. Program Progress Overview (MEDIUM WIDE TALL) */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">5. Program Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progData} layout="vertical" margin={{ left: -10, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} width={80} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="value" radius={[12,12,12,12]} barSize={20} background={{ fill: '#f1f5f9', radius: 12 }}>
                    {progData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 6. Coordinator Performance (MEDIUM WIDE TALL) */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">6. Coordinator Impact (Kids)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coordData} layout="vertical" margin={{ left: -10, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} width={60} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="children" fill="url(#colorAccent)" radius={[12,12,12,12]} barSize={20} background={{ fill: '#f1f5f9', radius: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 7. Worker Category Distribution (WIDE SHORT) */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">7. Worker Roles</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={workerCatData} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={({name, percent}) => percent && percent > 0.05 ? name : ''} stroke="none" paddingAngle={2}>
                    {workerCatData.map((e, i) => <Cell key={i} fill={workerColors[i % workerColors.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 8. Village Risk Level (WIDE SHORT DONUT) */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">8. Village Risk Levels</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={villageRiskData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="white" strokeWidth={3}>
                    {villageRiskData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b' }} layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 9. Follow-Up Completion (SMALL GAUGE) */}
        <motion.div variants={item} className="lg:col-span-1">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-0 text-center">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">9. Follow-ups</CardTitle>
            </CardHeader>
            <CardContent className="h-[180px] relative flex flex-col items-center justify-center pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={visitGaugeData} cx="50%" cy="85%" startAngle={180} endAngle={0} innerRadius={65} outerRadius={85} dataKey="value" stroke="none" cornerRadius={10}>
                    {visitGaugeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-4 flex flex-col items-center">
                <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{visitRate}%</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Completed</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 10. Inventory Health (SMALL GAUGE) */}
        <motion.div variants={item} className="lg:col-span-1">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-0 text-center">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">10. Inventory</CardTitle>
            </CardHeader>
            <CardContent className="h-[180px] relative flex flex-col items-center justify-center pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={invGaugeData} cx="50%" cy="85%" startAngle={180} endAngle={0} innerRadius={65} outerRadius={85} dataKey="value" stroke="none" cornerRadius={10}>
                    {invGaugeData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-4 flex flex-col items-center">
                <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{invRate}%</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">In Stock</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 11. Event Participation Trend (MEDIUM LINE) */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2">
          <Card className="h-full shadow-sm k-card-border k-card-bg backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">11. Event Participation</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eventTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Line type="monotone" dataKey="attendees" stroke={COLORS.Primary} strokeWidth={4} fill={COLORS.Primary} dot={{r: 4, strokeWidth: 0, fill: COLORS.Primary}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
