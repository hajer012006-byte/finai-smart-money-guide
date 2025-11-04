import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Goals = () => {
  const { toast } = useToast();
  const [showPlan, setShowPlan] = useState(false);

  const goals = [
    {
      id: 1,
      name: "شراء لابتوب جديد",
      target: 15000,
      current: 8500,
      duration: 6,
      monthlyTarget: 1083,
    },
    {
      id: 2,
      name: "رحلة صيفية",
      target: 8000,
      current: 3200,
      duration: 4,
      monthlyTarget: 1200,
    },
  ];

  const handleGeneratePlan = () => {
    setShowPlan(true);
    toast({
      title: "تم إنشاء الخطة الذكية 🎯",
      description: "تم تحليل وضعك المالي وإنشاء خطة مخصصة",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">أهدافي المالية</h1>
          <p className="text-muted-foreground">خطط وحقق أهدافك المالية بذكاء</p>
        </div>

        {/* الأهداف الحالية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {goals.map((goal, index) => (
            <Card key={goal.id} className="p-6 shadow-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">المدة: {goal.duration} شهور</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Target className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{goal.current} جنيه</span>
                    <span className="text-muted-foreground">{goal.target} جنيه</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round((goal.current / goal.target) * 100)}% مكتمل
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">المطلوب شهرياً</p>
                    <p className="text-lg font-semibold text-primary">{goal.monthlyTarget} جنيه</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">المتبقي</p>
                    <p className="text-lg font-semibold">{goal.target - goal.current} جنيه</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* إضافة هدف جديد */}
        <Card className="p-8 shadow-xl mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-2xl font-bold mb-6">إضافة هدف جديد</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="goalName">اسم الهدف</Label>
              <Input id="goalName" placeholder="مثلاً: شراء سيارة" className="text-right" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">المبلغ المستهدف (جنيه)</Label>
              <Input id="targetAmount" type="number" placeholder="0" className="text-right" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">المدة (بالشهور)</Label>
              <Input id="duration" type="number" placeholder="0" className="text-right" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">المبلغ الحالي (جنيه)</Label>
              <Input id="current" type="number" placeholder="0" className="text-right" />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleGeneratePlan} className="flex-1 gradient-success shadow-lg">
              <TrendingUp className="ml-2 w-5 h-5" />
              إنشاء خطة ذكية
            </Button>
            <Button variant="outline" className="flex-1">
              حفظ الهدف
            </Button>
          </div>
        </Card>

        {/* الخطة الذكية */}
        {showPlan && (
          <Card className="p-8 shadow-xl gradient-success/5 border-success/20 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">خطتك الذكية لتحقيق الهدف 🎯</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 rounded-xl bg-card">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground mb-1">الوقت المتوقع</p>
                <p className="text-2xl font-bold">5 شهور</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-card">
                <DollarSign className="w-8 h-8 mx-auto mb-3 text-success" />
                <p className="text-sm text-muted-foreground mb-1">وفّر شهرياً</p>
                <p className="text-2xl font-bold">1,200 جنيه</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-card">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground mb-1">نسبة النجاح</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">توصيات ذكية:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-4 rounded-lg bg-card">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-medium">قلل مصاريف الطعام الخارجي بنسبة 15%</p>
                    <p className="text-sm text-muted-foreground">سيوفر لك 180 جنيه شهرياً</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 rounded-lg bg-card">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium">اجعل نسبة الادخار 24% من دخلك</p>
                    <p className="text-sm text-muted-foreground">بدلاً من 20% الحالية</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 rounded-lg bg-card">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-medium">قلل اشتراكات الترفيه غير المستخدمة</p>
                    <p className="text-sm text-muted-foreground">يمكن توفير 120 جنيه شهرياً</p>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Goals;
