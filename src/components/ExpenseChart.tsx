import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  "طعام": "hsl(var(--warning))",
  "مواصلات": "hsl(var(--primary))",
  "فواتير": "hsl(var(--destructive))",
  "ترفيه": "hsl(var(--accent))",
  "أخرى": "hsl(var(--muted-foreground))",
};

interface ExpenseChartProps {
  data: Array<{ name: string; value: number }>;
}

export const ExpenseChart = ({ data }: ExpenseChartProps) => {
  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-4">توزيع المصروفات</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS["أخرى"]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
