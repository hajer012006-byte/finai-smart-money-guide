import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
}

interface Profile {
  full_name: string | null;
  monthly_income: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch expenses
      const { data: expensesData } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(10);

      if (expensesData) {
        setExpenses(expensesData);
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, monthly_income")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      setLoading(false);
    };

    fetchData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("expenses_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const monthlyIncome = profile?.monthly_income || 0;
  const savings = monthlyIncome - totalExpenses;
  const savingsRate = monthlyIncome > 0 ? ((savings / monthlyIncome) * 100).toFixed(0) : 0;

  // Get first name from full name
  const firstName = profile?.full_name?.split(' ')[0] || 'صديقي';

  // Group expenses by category for chart
  const categoryData = expenses.reduce((acc: any[], exp) => {
    const existing = acc.find((item) => item.name === exp.category);
    if (existing) {
      existing.value += Number(exp.amount);
    } else {
      acc.push({ name: exp.category, value: Number(exp.amount) });
    }
    return acc;
  }, []);

  // Format transactions for RecentTransactions component
  const transactions = expenses.map((exp) => ({
    id: exp.id,
    name: exp.name,
    category: exp.category,
    amount: Number(exp.amount),
    date: new Date(exp.date).toLocaleDateString("ar-EG"),
    type: "expense" as const,
  }));

  const stats = [
    {
      title: "إجمالي الدخل",
      value: `${monthlyIncome.toLocaleString()} جنيه`,
      icon: Wallet,
      trend: { value: "12%", isPositive: true },
      variant: "success" as const,
    },
    {
      title: "إجمالي المصروفات",
      value: `${totalExpenses.toLocaleString()} جنيه`,
      icon: TrendingDown,
      trend: { value: "5%", isPositive: false },
      variant: "danger" as const,
    },
    {
      title: "المدخرات المتوقعة",
      value: `${savings.toLocaleString()} جنيه`,
      icon: PiggyBank,
      trend: { value: "18%", isPositive: true },
      variant: "success" as const,
    },
    {
      title: "نسبة الادخار",
      value: `${savingsRate}%`,
      icon: TrendingUp,
      trend: { value: "3%", isPositive: true },
      variant: "default" as const,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">مرحباً {firstName} 👋</h1>
          <p className="text-muted-foreground">إليك ملخص وضعك المالي لهذا الشهر</p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* الرسوم البيانية والمعاملات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            {categoryData.length > 0 ? (
              <ExpenseChart data={categoryData} />
            ) : (
              <div className="p-6 text-center text-muted-foreground bg-card rounded-lg">
                لا توجد مصروفات لعرضها
              </div>
            )}
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
            {transactions.length > 0 ? (
              <RecentTransactions transactions={transactions} />
            ) : (
              <div className="p-6 text-center text-muted-foreground bg-card rounded-lg">
                لا توجد معاملات حديثة
              </div>
            )}
          </div>
        </div>

        {/* أزرار سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "600ms" }}>
          <Button asChild size="lg" className="gradient-primary h-16 text-lg shadow-lg hover:shadow-xl transition-smooth">
            <Link to="/add-expense">
              إضافة مصروف جديد
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16 text-lg border-2 hover:border-primary transition-smooth">
            <Link to="/goals">
              عرض أهدافي
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16 text-lg border-2 hover:border-primary transition-smooth">
            <Link to="/reports">
              التقارير الذكية
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
