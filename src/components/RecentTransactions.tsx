import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "expense" | "income";
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-4">المعاملات الأخيرة</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${transaction.type === "expense" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                  {transaction.type === "expense" ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              <div className="text-left">
                <p className={`font-semibold ${transaction.type === "expense" ? "text-destructive" : "text-success"}`}>
                  {transaction.type === "expense" ? "-" : "+"}{transaction.amount} جنيه
                </p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
