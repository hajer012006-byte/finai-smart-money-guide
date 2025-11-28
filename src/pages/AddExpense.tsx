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
import { ar } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AddExpense = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

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
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المصروف",
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم الحفظ بنجاح ✅",
        description: "تم إضافة المصروف الجديد",
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
            <h1 className="text-3xl font-bold mb-2">إضافة مصروف جديد</h1>
            <p className="text-muted-foreground">أضف تفاصيل المصروف لتتبع نفقاتك</p>
          </div>

          <Card className="p-8 shadow-xl animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المصروف</Label>
                <Input
                  id="name"
                  placeholder="مثلاً: وجبة غداء"
                  required
                  className="text-right"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Select required value={category} onValueChange={setCategory}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="طعام">طعام</SelectItem>
                    <SelectItem value="مواصلات">مواصلات</SelectItem>
                    <SelectItem value="فواتير">فواتير</SelectItem>
                    <SelectItem value="ترفيه">ترفيه</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ (جنيه)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className="text-right"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>التاريخ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-right font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
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
                  {loading ? "جاري الحفظ..." : "حفظ المصروف"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  إلغاء
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
