import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle, Target, TrendingUp, Bell, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl">CashIQ</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
              className={isActive("/") ? "gradient-primary" : ""}
            >
              <Link to="/">
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </Link>
            </Button>

            <Button
              variant={isActive("/add-expense") ? "default" : "ghost"}
              size="sm"
              asChild
              className={isActive("/add-expense") ? "gradient-primary" : ""}
            >
              <Link to="/add-expense">
                <PlusCircle className="w-4 h-4 ml-2" />
                إضافة
              </Link>
            </Button>

            <Button
              variant={isActive("/goals") ? "default" : "ghost"}
              size="sm"
              asChild
              className={isActive("/goals") ? "gradient-primary" : ""}
            >
              <Link to="/goals">
                <Target className="w-4 h-4 ml-2" />
                الأهداف
              </Link>
            </Button>

            <Button
              variant={isActive("/reports") ? "default" : "ghost"}
              size="sm"
              asChild
              className={isActive("/reports") ? "gradient-primary" : ""}
            >
              <Link to="/reports">
                <TrendingUp className="w-4 h-4 ml-2" />
                التقارير
              </Link>
            </Button>

            <Button
              variant={isActive("/notifications") ? "default" : "ghost"}
              size="sm"
              asChild
              className={isActive("/notifications") ? "gradient-primary" : ""}
            >
              <Link to="/notifications">
                <Bell className="w-4 h-4 ml-2" />
                التنبيهات
              </Link>
            </Button>

            <Button
              variant={isActive("/settings") ? "default" : "ghost"}
              size="sm"
              asChild
              className={isActive("/settings") ? "gradient-primary" : ""}
            >
              <Link to="/settings">
                <Settings className="w-4 h-4 ml-2" />
                الإعدادات
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
