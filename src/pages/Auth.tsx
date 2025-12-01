import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  // Load saved email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message === "Invalid login credentials" 
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : error.message,
        variant: "destructive",
      });
    } else {
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      toast({
        title: "تم تسجيل الدخول بنجاح ✅",
        description: "مرحباً بك مرة أخرى",
      });
      navigate("/");
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message === "User already registered"
          ? "هذا البريد الإلكتروني مسجل بالفعل"
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم إنشاء الحساب بنجاح ✅",
        description: "يمكنك الآن تسجيل الدخول",
      });
      setIsLogin(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">💰 تطبيق المصروفات</h1>
          <p className="text-muted-foreground">إدارة مصروفاتك بذكاء</p>
        </div>

        <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">البريد الإلكتروني</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-right"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">كلمة المرور</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label 
                  htmlFor="remember-me" 
                  className="text-sm font-normal cursor-pointer"
                >
                  تذكر البريد الإلكتروني
                </Label>
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">الاسم الكامل</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="أحمد محمد"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-right"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">كلمة المرور</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="text-right"
                  dir="ltr"
                />
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
