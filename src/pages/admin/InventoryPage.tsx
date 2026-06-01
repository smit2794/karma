import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useAppContext } from "@/store";
import { InventoryItem } from "@/data/mockData";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { StatCard } from "@/components/shared/StatCard";
import { Package } from "lucide-react";
import "./InventoryPage.css";

export default function InventoryPage() {
  const { inventory } = useAppContext();

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-semibold" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Item Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "currentStock",
      header: "Total Stock",
    },
    {
      accessorKey: "usedStock",
      header: "Used",
    },
    {
      accessorKey: "remainingStock",
      header: "Remaining",
    },
    {
      accessorKey: "district",
      header: "District",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge className={s === "In Stock" ? "k-bg-primary-soft k-text-primary k-bg-primary-hover" : s === "Low Stock" ? "k-bg-warning-soft k-text-warning k-bg-warning-hover" : "k-bg-destructive-soft k-text-destructive k-bg-destructive-hover"}>
            {s}
          </Badge>
        );
      },
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 k-page-bg">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
        <p className="k-text-muted">Monitor and track inventory across all districts.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Items Tracking"
          value={inventory.length}
          icon={<Package size={20} />}
          bgIcon={<Package />}
          color="primary"
        />
        <StatCard
          title="Low Stock Alerts"
          value={inventory.filter(i => i.status === "Low Stock").length}
          icon={<Package size={20} />}
          bgIcon={<Package />}
          color="warning"
          className="border k-border-warning"
        />
        <StatCard
          title="Out of Stock"
          value={inventory.filter(i => i.status === "Out of Stock").length}
          icon={<Package size={20} />}
          bgIcon={<Package />}
          color="destructive"
          className="border k-border-destructive"
        />
      </div>

      <DataTable 
        columns={columns} 
        data={inventory} 
        searchKey="name" 
        searchPlaceholder="Search items..." 
      />
    </motion.div>
  );
}
