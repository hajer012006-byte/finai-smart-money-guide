import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  const variantStyles = {
    default: "from-primary/10 to-primary/5 border-primary/20",
    success: "from-success/10 to-success/5 border-success/20",
    warning: "from-warning/10 to-warning/5 border-warning/20",
    danger: "from-destructive/10 to-destructive/5 border-destructive/20",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${variantStyles[variant]} border-2 shadow-card transition-smooth hover:shadow-lg hover:scale-105 animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trend.isPositive ? "text-success" : "text-destructive"}`}>
              {trend.isPositive ? "+" : ""}{trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconStyles[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
