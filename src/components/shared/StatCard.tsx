import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgIcon?: ReactNode; // Added support for massive background icon
  color?: "primary" | "orange" | "red" | "green" | "blue" | "indigo" | "yellow" | "secondary" | "warning" | "destructive" | "accent"; // Color mode for the icon
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, bgIcon, color = "primary", description, trend, className }: StatCardProps) {
  
  // Dynamic color maps for the icon background and text
  const colorStyles = {
    primary: "from-primary/20 to-primary/5 text-primary",
    secondary: "from-secondary/20 to-secondary/5 text-secondary",
    warning: "from-warning/20 to-warning/5 text-warning-foreground",
    destructive: "from-destructive/20 to-destructive/5 text-destructive",
    accent: "from-accent/20 to-accent/5 text-accent",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-500",
    red: "from-red-500/20 to-red-500/5 text-red-500",
    green: "from-emerald-500/20 to-emerald-500/5 text-emerald-500",
    blue: "from-blue-500/20 to-blue-500/5 text-blue-500",
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-500",
    yellow: "from-yellow-500/20 to-yellow-500/5 text-yellow-600",
  };

  const bgIconColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    warning: "text-warning-foreground",
    destructive: "text-destructive",
    accent: "text-accent",
    orange: "text-orange-500",
    red: "text-red-500",
    green: "text-emerald-500",
    blue: "text-blue-500",
    indigo: "text-indigo-500",
    yellow: "text-yellow-500",
  };

  return (
    <Card className={cn("relative overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 dark:bg-slate-900/80 group", className)}>
      {/* Background Icon Watermark */}
      {bgIcon && (
        <div className={cn("absolute -right-8 -bottom-8 opacity-[0.05] dark:opacity-[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 pointer-events-none [&>svg]:w-40 [&>svg]:h-40", bgIconColors[color])}>
          {bgIcon}
        </div>
      )}
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10 px-8 pt-8">
        <CardTitle className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</CardTitle>
        <div className={cn("w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm", colorStyles[color])}>
          {icon}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 px-8 pb-8">
        <div className="text-4xl lg:text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100">{value}</div>
        {(description || trend) && (
          <p className="text-[13px] text-muted-foreground mt-3 flex items-center gap-1.5 font-semibold">
            {trend && (
              <span className={cn("px-2 py-1 rounded-lg", trend.isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400")}>
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
