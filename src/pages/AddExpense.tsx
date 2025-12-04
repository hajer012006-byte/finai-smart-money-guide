import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const AddExpense = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const categories = [
    { value: "طعام", labelAr: "طعام", labelEn: "Food" },
    { value: "مواصلات", labelAr: "مواصلات", labelEn: "Transportation" },
    { value: "فواتير", labelAr: "فواتير", labelEn: "Bills" },
    { value: "ترفيه", labelAr: "ترفيه", labelEn: "Entertainment" },
    { value: "أخرى", labelAr: "أخرى", labelEn: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("expenses").insert({
      user_id: user?.id,
      name,
      category,
      amount: parseFloat(amount),
      date: date?.toISOString().split('T')[0],
    });

    if (error) {
      toast({
        title: t("خطأ", "Error"),
        description: t("حدث خطأ أثناء حفظ المصروف", "An error occurred while saving the expense"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("تم الحفظ بنجاح", "Saved Successfully"),
        description: t("تم إضافة المصروف الجديد", "New expense has been added"),
      });
      setTimeout(() => navigate("/"), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">{t("إضافة مصروف جديد", "Add New Expense")}</h1>
            <p className="text-muted-foreground">{t("أضف تفاصيل المصروف لتتبع نفقاتك", "Add expense details to track your spending")}</p>
          </div>

          <Card className="p-8 shadow-xl animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("اسم المصروف", "Expense Name")}</Label>
                <Input
                  id="name"
                  placeholder={t("مثلاً: وجبة غداء", "e.g., Lunch")}
                  required
                  className={language === "ar" ? "text-right" : "text-left"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t("الفئة", "Category")}</Label>
                <Select required value={category} onValueChange={setCategory}>
                  <SelectTrigger className={language === "ar" ? "text-right" : "text-left"}>
                    <SelectValue placeholder={t("اختر الفئة", "Select Category")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {language === "ar" ? cat.labelAr : cat.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t("المبلغ (جنيه)", "Amount (EGP)")}</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className={language === "ar" ? "text-right" : "text-left"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("التاريخ", "Date")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${language === "ar" ? "text-right" : "text-left"} font-normal`}
                    >
                      <CalendarIcon className={language === "ar" ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"} />
                      {date ? format(date, "PPP", { locale: language === "ar" ? ar : enUS }) : <span>{t("اختر التاريخ", "Select Date")}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 gradient-primary shadow-lg" disabled={loading}>
                  {loading ? t("جاري الحفظ...", "Saving...") : t("حفظ المصروف", "Save Expense")}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  {t("إلغاء", "Cancel")}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddExpense;
