import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface CategoryTrend {
  category: string;
  current: number;
  previous: number;
}

interface Insight {
  type: "warning" | "success" | "info";
  icon: any;
  title: string;
  description: string;
}

const Reports = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [expensesResult, profileResult] = await Promise.all([
        supabase.from("expenses").select("*").eq("user_id", user.id).order("date", { ascending: true }),
        supabase.from("profiles").select("monthly_income").eq("id", user.id).single()
      ]);

      if (expensesResult.error) throw expensesResult.error;
      if (profileResult.error) throw profileResult.error;

      setExpenses(expensesResult.data || []);
      setMonthlyIncome(profileResult.data?.monthly_income || 0);
      
      // Generate AI insights
      await generateInsights(expensesResult.data || [], profileResult.data?.monthly_income || 0);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (expensesData: Expense[], income: number) => {
    try {
      const response = await supabase.functions.invoke("generate-insights", {
        body: { expenses: expensesData, monthlyIncome: income }
      });

      if (response.data?.insights) {
        setInsights(response.data.insights.map((insight: any) => ({
          ...insight,
          icon: insight.type === "warning" ? AlertCircle : insight.type === "success" ? CheckCircle : TrendingDown
        })));
      }
    } catch (error) {
      console.error("Error generating insights:", error);
    }
  };

  const getMonthlyData = (): MonthlyData[] => {
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIndex = date.getMonth();
      const monthExpenses = expenses
        .filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      last6Months.push({
        month: months[monthIndex],
        income: monthlyIncome,
        expenses: monthExpenses
      });
    }
    
    return last6Months;
  };

  const getCategoryTrends = (): CategoryTrend[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    const categories = ["طعام", "مواصلات", "فواتير", "ترفيه"];
    
    return categories.map(category => {
      const currentExpenses = expenses
        .filter(e => {
          const date = new Date(e.date);
          return date.getMonth() === currentMonth && e.category === category;
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      const previousExpenses = expenses
        .filter(e => {
          const date = new Date(e.date);
          return date.getMonth() === previousMonth && e.category === category;
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      return {
        category,
        current: currentExpenses,
        previous: previousExpenses
      };
    });
  };

  const getStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    const currentMonthExpenses = expenses
      .filter(e => new Date(e.date).getMonth() === currentMonth)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    
    const previousMonthExpenses = expenses
      .filter(e => new Date(e.date).getMonth() === previousMonth)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    
    const savingsIncrease = ((monthlyIncome - currentMonthExpenses) / (monthlyIncome - previousMonthExpenses) - 1) * 100;
    const expenseDecrease = ((previousMonthExpenses - currentMonthExpenses) / previousMonthExpenses) * 100;
    const budgetCompliance = ((monthlyIncome - currentMonthExpenses) / monthlyIncome) * 100;
    
    return {
      savingsIncrease: isFinite(savingsIncrease) ? savingsIncrease.toFixed(0) : "0",
      expenseDecrease: isFinite(expenseDecrease) ? expenseDecrease.toFixed(0) : "0",
      budgetCompliance: isFinite(budgetCompliance) ? budgetCompliance.toFixed(0) : "0"
    };
  };

  const monthlyData = getMonthlyData();
  const categoryTrends = getCategoryTrends();
  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">التقارير والإحصائيات</h1>
          <p className="text-muted-foreground">تحليل ذكي لسلوكك المالي</p>
        </div>

        {/* الرسم البياني الخطي */}
        <Card className="p-6 shadow-card mb-8 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4">الدخل والمصروفات الشهرية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="hsl(var(--success))" strokeWidth={3} name="الدخل" />
              <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={3} name="المصروفات" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* مقارنة الفئات */}
        <Card className="p-6 shadow-card mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-lg font-semibold mb-4">مقارنة المصروفات بالشهر السابق</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="previous" fill="hsl(var(--muted))" name="الشهر السابق" />
              <Bar dataKey="current" fill="hsl(var(--primary))" name="الشهر الحالي" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* الرؤى الذكية */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-2xl font-bold mb-4">رؤى ذكية 🤖</h2>
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const colorClasses = {
              warning: "bg-warning/10 text-warning border-warning/20",
              success: "bg-success/10 text-success border-success/20",
              info: "bg-primary/10 text-primary border-primary/20",
            };

            return (
              <Card
                key={index}
                className={`p-6 border-2 ${colorClasses[insight.type as keyof typeof colorClasses]} transition-smooth hover:scale-105`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-card">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{insight.title}</h4>
                    <p className="text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* إحصائيات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <Card className="p-6 text-center shadow-card">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-success" />
            <p className="text-2xl font-bold mb-1">{stats.savingsIncrease > "0" ? "+" : ""}{stats.savingsIncrease}%</p>
            <p className="text-sm text-muted-foreground">زيادة في المدخرات</p>
          </Card>
          <Card className="p-6 text-center shadow-card">
            <TrendingDown className="w-10 h-10 mx-auto mb-3 text-destructive" />
            <p className="text-2xl font-bold mb-1">{stats.expenseDecrease > "0" ? "-" : ""}{stats.expenseDecrease}%</p>
            <p className="text-sm text-muted-foreground">انخفاض في المصروفات</p>
          </Card>
          <Card className="p-6 text-center shadow-card">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-primary" />
            <p className="text-2xl font-bold mb-1">{stats.budgetCompliance}%</p>
            <p className="text-sm text-muted-foreground">الالتزام بالميزانية</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
