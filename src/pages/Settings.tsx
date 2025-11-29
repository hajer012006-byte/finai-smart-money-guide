import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, monthly_income")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setMonthlyIncome(data.monthly_income?.toString() || "0");
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        monthly_income: parseFloat(monthlyIncome) || 0,
      })
      .eq("id", user?.id);

    if (error) {
      toast({
        title: "خطأ في الحفظ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الحفظ بنجاح ✅",
        description: "تم تحديث معلوماتك الشخصية",
      });
    }

    setLoading(false);
  };

  const handleClearAllData = async () => {
    if (!user) return;
    setDeleting(true);

    // Delete all user expenses
    const { error: expensesError } = await supabase
      .from("expenses")
      .delete()
      .eq("user_id", user.id);

    // Delete all user goals
    const { error: goalsError } = await supabase
      .from("goals")
      .delete()
      .eq("user_id", user.id);

    // Reset profile data
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        monthly_income: 0,
      })
      .eq("id", user.id);

    if (expensesError || goalsError || profileError) {
      toast({
        title: "خطأ في حذف البيانات",
        description: "حدث خطأ أثناء حذف البيانات",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم حذف جميع البيانات ✅",
        description: "تم مسح جميع المصروفات والأهداف",
      });
      setMonthlyIncome("0");
    }

    setDeleting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
            <p className="text-muted-foreground">إدارة معلوماتك الشخصية والتطبيق</p>
          </div>

          <Card className="p-6 mb-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-6">المعلومات الشخصية</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-right"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">الدخل الشهري (جنيه)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="text-right"
                  dir="ltr"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  سيتم استخدام هذا الرقم لحساب المدخرات والإحصائيات
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ التغييرات"
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-6 border-destructive/20 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h2 className="text-xl font-semibold mb-4 text-destructive">انتبه ⚠️</h2>
            <p className="text-muted-foreground mb-4">
              احذف جميع البيانات وابدأ من جديد. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الحذف...
                    </>
                  ) : (
                    <>
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف جميع البيانات
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيتم حذف جميع المصروفات والأهداف نهائياً. لا يمكن التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAllData}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    نعم، احذف كل شيء
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;