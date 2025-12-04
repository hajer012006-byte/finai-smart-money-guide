import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { t, language } = useLanguage();

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
        title: t("خطأ في تسجيل الدخول", "Login Error"),
        description: error.message === "Invalid login credentials" 
          ? t("البريد الإلكتروني أو كلمة المرور غير صحيحة", "Invalid email or password")
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("تم تسجيل الدخول بنجاح", "Login Successful"),
        description: t("مرحباً بك مرة أخرى", "Welcome back"),
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
        title: t("خطأ في إنشاء الحساب", "Signup Error"),
        description: error.message === "User already registered"
          ? t("هذا البريد الإلكتروني مسجل بالفعل", "This email is already registered")
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("تم إنشاء الحساب بنجاح", "Account Created Successfully"),
        description: t("يمكنك الآن تسجيل الدخول", "You can now log in"),
      });
      setIsLogin(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t("تطبيق المصروفات", "Expense App")}</h1>
          <p className="text-muted-foreground">{t("إدارة مصروفاتك بذكاء", "Manage your expenses smartly")}</p>
        </div>

        <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("تسجيل الدخول", "Login")}</TabsTrigger>
            <TabsTrigger value="signup">{t("إنشاء حساب", "Sign Up")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{t("البريد الإلكتروني", "Email")}</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={language === "ar" ? "text-right" : "text-left"}
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">{t("كلمة المرور", "Password")}</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={language === "ar" ? "text-right" : "text-left"}
                  dir="ltr"
                />
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? t("جاري تسجيل الدخول...", "Logging in...") : t("تسجيل الدخول", "Login")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t("الاسم الكامل", "Full Name")}</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder={t("هاجر", "Hagar")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className={language === "ar" ? "text-right" : "text-left"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">{t("البريد الإلكتروني", "Email")}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={language === "ar" ? "text-right" : "text-left"}
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">{t("كلمة المرور", "Password")}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={language === "ar" ? "text-right" : "text-left"}
                  dir="ltr"
                />
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? t("جاري إنشاء الحساب...", "Creating account...") : t("إنشاء حساب", "Sign Up")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
