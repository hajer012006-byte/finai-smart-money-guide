import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

const Reports = () => {
  const monthlyData = [
    { month: "يناير", income: 5000, expenses: 4200 },
    { month: "فبراير", income: 5200, expenses: 3800 },
    { month: "مارس", income: 5000, expenses: 4100 },
    { month: "أبريل", income: 5500, expenses: 3900 },
    { month: "مايو", income: 5300, expenses: 4500 },
    { month: "يونيو", income: 5000, expenses: 3450 },
  ];

  const categoryTrends = [
    { category: "طعام", current: 1200, previous: 1070 },
    { category: "مواصلات", current: 800, previous: 850 },
    { category: "فواتير", current: 600, previous: 580 },
    { category: "ترفيه", current: 450, previous: 400 },
  ];

  const insights = [
    {
      type: "warning",
      icon: AlertCircle,
      title: "إنفاقك على الترفيه زاد 12%",
      description: "مقارنة بالشهر الماضي. حاول التقليل للوصول لهدفك أسرع.",
    },
    {
      type: "success",
      icon: CheckCircle,
      title: "وفرت 300 جنيه أكثر من المتوقع",
      description: "استمر على هذا النهج وستحقق هدفك قبل الموعد!",
    },
    {
      type: "info",
      icon: TrendingDown,
      title: "مصاريف المواصلات انخفضت 6%",
      description: "نتيجة ممتازة! استخدامك للمواصلات العامة يوفر المال.",
    },
  ];

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
            <p className="text-2xl font-bold mb-1">+18%</p>
            <p className="text-sm text-muted-foreground">زيادة في المدخرات</p>
          </Card>
          <Card className="p-6 text-center shadow-card">
            <TrendingDown className="w-10 h-10 mx-auto mb-3 text-destructive" />
            <p className="text-2xl font-bold mb-1">-5%</p>
            <p className="text-sm text-muted-foreground">انخفاض في المصروفات</p>
          </Card>
          <Card className="p-6 text-center shadow-card">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-primary" />
            <p className="text-2xl font-bold mb-1">87%</p>
            <p className="text-sm text-muted-foreground">الالتزام بالميزانية</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
