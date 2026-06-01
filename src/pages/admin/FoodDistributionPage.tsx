import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, PackageCheck, Utensils, HeartPulse, Droplet, Users } from "lucide-react";
import { useAppContext } from "@/store";
import { FoodDistribution } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { StatCard } from "@/components/shared/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import "./FoodDistributionPage.css";

export default function FoodDistributionPage() {
  const { foodDistribution, villages } = useAppContext();

  const getVillageName = (id: string) => villages.find(v => v.id === id)?.name || id;

  const columns: ColumnDef<FoodDistribution>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "villageId",
      header: "Village",
      cell: ({ row }) => <span className="font-medium">{getVillageName(row.original.villageId)}</span>,
    },
    {
      accessorKey: "foodCategory",
      header: "Category",
      cell: ({ row }) => {
        const cat = row.original.foodCategory;
        const colorClass = cat === "Staples" ? "k-bg-warning-soft k-text-warning k-bg-warning-hover" :
                           cat === "Proteins" ? "k-bg-destructive-soft k-text-destructive k-bg-destructive-hover" :
                           cat === "Oils" ? "k-bg-accent-soft k-text-accent k-bg-accent-hover" :
                           "k-bg-primary-soft k-text-primary";
        return <Badge variant="secondary" className={colorClass}>{cat}</Badge>;
      }
    },
    {
      accessorKey: "foodItem",
      header: "Item",
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`,
    },
    {
      accessorKey: "childrenServed",
      header: "Children Served",
    },
  ];

  // Stats calculation
  const totalStaples = foodDistribution.filter(f => f.foodCategory === "Staples").reduce((acc, f) => acc + f.quantity, 0);
  const totalProteins = foodDistribution.filter(f => f.foodCategory === "Proteins").reduce((acc, f) => acc + f.quantity, 0);
  const totalOils = foodDistribution.filter(f => f.foodCategory === "Oils").reduce((acc, f) => acc + f.quantity, 0);
  const totalSupplements = foodDistribution.filter(f => f.foodCategory === "Supplements").reduce((acc, f) => acc + f.quantity, 0);
  const totalChildrenServed = foodDistribution.reduce((acc, f) => acc + f.childrenServed, 0);

  // Chart Data
  const pieData = [
    { name: "Staples (kg)", value: totalStaples, color: "#F9C642" }, // warning
    { name: "Proteins (kg)", value: totalProteins, color: "#D92B2B" }, // destructive
    { name: "Oils (L)", value: totalOils, color: "#F28C28" }, // accent
    { name: "Supplements (kits)", value: totalSupplements, color: "#0B6CC4" }, // primary
  ];

  // Group by village for Bar chart
  const villageData = useMemo(() => {
    const data: Record<string, number> = {};
    foodDistribution.forEach(f => {
      const vName = getVillageName(f.villageId);
      data[vName] = (data[vName] || 0) + f.childrenServed;
    });
    return Object.entries(data).map(([name, served]) => ({ name, served })).sort((a,b) => b.served - a.served);
  }, [foodDistribution]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={container} className="space-y-6 k-page-bg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Food Distribution</h2>
        <p className="k-text-muted">Track and manage nutritional deliveries across villages.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <motion.div variants={item}>
          <StatCard title="Staples Distributed" value={`${totalStaples} kg`} icon={<Utensils size={20} />} bgIcon={<Utensils />} color="warning" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Proteins Distributed" value={`${totalProteins} kg`} icon={<HeartPulse size={20} />} bgIcon={<HeartPulse />} color="red" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Oils Distributed" value={`${totalOils} L`} icon={<Droplet size={20} />} bgIcon={<Droplet />} color="orange" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Nutrition Kits" value={totalSupplements} icon={<PackageCheck size={20} />} bgIcon={<PackageCheck />} color="primary" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Children Served" value={totalChildrenServed} icon={<Users size={20} />} bgIcon={<Users />} color="primary" className="k-bg-primary-soft k-border-primary" />
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Village Impact Breakdown</CardTitle>
              <CardDescription>Total children served per village through distributions.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={villageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="served" fill="#5DBCEB" radius={[4, 4, 0, 0]} name="Children Served" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full border-none shadow-md dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Distribution Categories</CardTitle>
              <CardDescription>Proportional breakdown of distributed items.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <DataTable 
          columns={columns} 
          data={foodDistribution} 
          searchKey="foodItem" 
          searchPlaceholder="Search food item..." 
        />
      </motion.div>
    </motion.div>
  );
}
