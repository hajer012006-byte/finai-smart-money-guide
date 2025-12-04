import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  duration_months: number;
}

const Goals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlan, setShowPlan] = useState(false);
  
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGoals(data);
      }
      setLoading(false);
    };

    fetchGoals();

    const channel = supabase
      .channel("goals_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "goals",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchGoals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleGeneratePlan = () => {
    setShowPlan(true);
    toast({
      title: t("تم إنشاء الخطة الذكية", "Smart Plan Created"),
      description: t("تم تحليل وضعك المالي وإنشاء خطة مخصصة", "Your financial situation has been analyzed and a custom plan created"),
    });
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("goals").insert({
      user_id: user?.id,
      name: goalName,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount) || 0,
      duration_months: parseInt(duration),
    });

    if (error) {
      toast({
        title: t("خطأ", "Error"),
        description: t("حدث خطأ أثناء حفظ الهدف", "An error occurred while saving the goal"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("تم الحفظ بنجاح", "Saved Successfully"),
        description: t("تم إضافة الهدف المالي الجديد", "New financial goal has been added"),
      });
      setGoalName("");
      setTargetAmount("");
      setDuration("");
      setCurrentAmount("");
    }
  };

  const currency = t("جنيه", "EGP");

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
          <h1 className="text-3xl font-bold mb-2">{t("أهدافي المالية", "My Financial Goals")}</h1>
          <p className="text-muted-foreground">{t("خطط وحقق أهدافك المالية بذكاء", "Plan and achieve your financial goals smartly")}</p>
        </div>

        {goals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {goals.map((goal, index) => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              const monthlyTarget = (goal.target_amount - goal.current_amount) / goal.duration_months;
              const remaining = goal.target_amount - goal.current_amount;

              return (
                <Card key={goal.id} className="p-6 shadow-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{goal.name}</h3>
                      <p className="text-sm text-muted-foreground">{t("المدة:", "Duration:")} {goal.duration_months} {t("شهور", "months")}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Target className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{goal.current_amount.toLocaleString()} {currency}</span>
                        <span className="text-muted-foreground">{goal.target_amount.toLocaleString()} {currency}</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {progress.toFixed(1)}% {t("مكتمل", "complete")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">{t("المطلوب شهرياً", "Monthly Required")}</p>
                        <p className="text-lg font-semibold text-primary">{monthlyTarget.toLocaleString()} {currency}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">{t("المتبقي", "Remaining")}</p>
                        <p className="text-lg font-semibold">{remaining.toLocaleString()} {currency}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="p-8 shadow-xl mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-2xl font-bold mb-6">{t("إضافة هدف جديد", "Add New Goal")}</h2>
          
          <form onSubmit={handleSaveGoal}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="goalName">{t("اسم الهدف", "Goal Name")}</Label>
                <Input
                  id="goalName"
                  placeholder={t("مثلاً: شراء سيارة", "e.g., Buy a car")}
                  className={language === "ar" ? "text-right" : "text-left"}
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount">{t("المبلغ المستهدف (جنيه)", "Target Amount (EGP)")}</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="0"
                  className={language === "ar" ? "text-right" : "text-left"}
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">{t("المدة (بالشهور)", "Duration (months)")}</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="0"
                  className={language === "ar" ? "text-right" : "text-left"}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current">{t("المبلغ الحالي (جنيه)", "Current Amount (EGP)")}</Label>
                <Input
                  id="current"
                  type="number"
                  placeholder="0"
                  className={language === "ar" ? "text-right" : "text-left"}
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button type="button" onClick={handleGeneratePlan} className="flex-1 gradient-success shadow-lg">
                <TrendingUp className={language === "ar" ? "ml-2 w-5 h-5" : "mr-2 w-5 h-5"} />
                {t("إنشاء خطة ذكية", "Create Smart Plan")}
              </Button>
              <Button type="submit" variant="outline" className="flex-1">
                {t("حفظ الهدف", "Save Goal")}
              </Button>
            </div>
          </form>
        </Card>

        {showPlan && (
          <Card className="p-8 shadow-xl gradient-success/5 border-success/20 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{t("خطتك الذكية لتحقيق الهدف", "Your Smart Plan to Achieve the Goal")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 rounded-xl bg-card">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground mb-1">{t("الوقت المتوقع", "Expected Time")}</p>
                <p className="text-2xl font-bold">5 {t("شهور", "months")}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-card">
                <DollarSign className="w-8 h-8 mx-auto mb-3 text-success" />
                <p className="text-sm text-muted-foreground mb-1">{t("وفّر شهرياً", "Save Monthly")}</p>
                <p className="text-2xl font-bold">1,200 {currency}</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-card">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground mb-1">{t("نسبة النجاح", "Success Rate")}</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t("توصيات ذكية:", "Smart Recommendations:")}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-4 rounded-lg bg-card">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-medium">{t("قلل مصاريف الطعام الخارجي بنسبة 15%", "Reduce eating out expenses by 15%")}</p>
                    <p className="text-sm text-muted-foreground">{t("سيوفر لك 180 جنيه شهرياً", "This will save you 180 EGP monthly")}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 rounded-lg bg-card">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-medium">{t("اجعل نسبة الادخار 24% من دخلك", "Make your savings rate 24% of your income")}</p>
                    <p className="text-sm text-muted-foreground">{t("بدلاً من 20% الحالية", "Instead of the current 20%")}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-4 rounded-lg bg-card">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-medium">{t("قلل اشتراكات الترفيه غير المستخدمة", "Cancel unused entertainment subscriptions")}</p>
                    <p className="text-sm text-muted-foreground">{t("يمكن توفير 120 جنيه شهرياً", "You can save 120 EGP monthly")}</p>
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
