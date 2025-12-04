import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Globe } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
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
        title: t("خطأ في الحفظ", "Save Error"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("تم الحفظ بنجاح", "Saved Successfully"),
        description: t("تم تحديث معلوماتك الشخصية", "Your personal information has been updated"),
      });
    }

    setLoading(false);
  };

  const handleClearAllData = async () => {
    if (!user) return;
    setDeleting(true);

    const { error: expensesError } = await supabase
      .from("expenses")
      .delete()
      .eq("user_id", user.id);

    const { error: goalsError } = await supabase
      .from("goals")
      .delete()
      .eq("user_id", user.id);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        monthly_income: 0,
      })
      .eq("id", user.id);

    if (expensesError || goalsError || profileError) {
      toast({
        title: t("خطأ في حذف البيانات", "Delete Error"),
        description: t("حدث خطأ أثناء حذف البيانات", "An error occurred while deleting data"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("تم حذف جميع البيانات", "All Data Deleted"),
        description: t("تم مسح جميع المصروفات والأهداف", "All expenses and goals have been cleared"),
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
            <h1 className="text-3xl font-bold mb-2">{t("الإعدادات", "Settings")}</h1>
            <p className="text-muted-foreground">{t("إدارة معلوماتك الشخصية والتطبيق", "Manage your personal information and app settings")}</p>
          </div>

          {/* Language Settings */}
          <Card className="p-6 mb-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5" />
              <h2 className="text-xl font-semibold">{t("اللغة", "Language")}</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">{t("اختر اللغة", "Select Language")}</Label>
              <Select value={language} onValueChange={(value: "ar" | "en") => setLanguage(value)}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-6 mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h2 className="text-xl font-semibold mb-6">{t("المعلومات الشخصية", "Personal Information")}</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("الاسم الكامل", "Full Name")}</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={language === "ar" ? "text-right" : "text-left"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">{t("الدخل الشهري (جنيه)", "Monthly Income (EGP)")}</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className={language === "ar" ? "text-right" : "text-left"}
                  dir="ltr"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  {t("سيتم استخدام هذا الرقم لحساب المدخرات والإحصائيات", "This number will be used to calculate savings and statistics")}
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
                    {t("جاري الحفظ...", "Saving...")}
                  </>
                ) : (
                  t("حفظ التغييرات", "Save Changes")
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-6 border-destructive/20 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h2 className="text-xl font-semibold mb-4 text-destructive">{t("انتبه", "Warning")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("احذف جميع البيانات وابدأ من جديد. هذا الإجراء لا يمكن التراجع عنه.", "Delete all data and start fresh. This action cannot be undone.")}
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
                      {t("جاري الحذف...", "Deleting...")}
                    </>
                  ) : (
                    <>
                      <Trash2 className="ml-2 h-4 w-4" />
                      {t("حذف جميع البيانات", "Delete All Data")}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("هل أنت متأكد؟", "Are you sure?")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("سيتم حذف جميع المصروفات والأهداف نهائياً. لا يمكن التراجع عن هذا الإجراء.", "All expenses and goals will be permanently deleted. This action cannot be undone.")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("إلغاء", "Cancel")}</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAllData}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {t("نعم، احذف كل شيء", "Yes, delete everything")}
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