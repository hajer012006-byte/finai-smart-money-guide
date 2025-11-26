import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // بيانات تجريبية
  const stats = [
    {
      title: "إجمالي الدخل",
      value: "5,000 جنيه",
      icon: Wallet,
      trend: { value: "12%", isPositive: true },
      variant: "success" as const,
    },
    {
      title: "إجمالي المصروفات",
      value: "3,450 جنيه",
      icon: TrendingDown,
      trend: { value: "5%", isPositive: false },
      variant: "danger" as const,
    },
    {
      title: "المدخرات المتوقعة",
      value: "1,550 جنيه",
      icon: PiggyBank,
      trend: { value: "18%", isPositive: true },
      variant: "success" as const,
    },
    {
      title: "نسبة الادخار",
      value: "31%",
      icon: TrendingUp,
      trend: { value: "3%", isPositive: true },
      variant: "default" as const,
    },
  ];

  const expenseData = [
    { name: "طعام", value: 1200 },
    { name: "مواصلات", value: 800 },
    { name: "فواتير", value: 600 },
    { name: "ترفيه", value: 450 },
    { name: "أخرى", value: 400 },
  ];

  const transactions = [
    {
      id: "1",
      name: "ماكدونالدز",
      category: "طعام",
      amount: 85,
      date: "اليوم",
      type: "expense" as const,
    },
    {
      id: "2",
      name: "أوبر",
      category: "مواصلات",
      amount: 35,
      date: "أمس",
      type: "expense" as const,
    },
    {
      id: "3",
      name: "راتب شهري",
      category: "دخل",
      amount: 5000,
      date: "منذ يومين",
      type: "income" as const,
    },
    {
      id: "4",
      name: "نتفليكس",
      category: "ترفيه",
      amount: 120,
      date: "منذ 3 أيام",
      type: "expense" as const,
    },
    {
      id: "5",
      name: "فاتورة الكهرباء",
      category: "فواتير",
      amount: 200,
      date: "منذ 4 أيام",
      type: "expense" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">مرحباً 👋</h1>
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
            <ExpenseChart data={expenseData} />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
            <RecentTransactions transactions={transactions} />
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
