import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Bell, Zap, Target, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

const Notifications = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }
    setLoading(false);
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      AlertTriangle,
      TrendingUp,
      Bell,
      Zap,
      Target,
    };
    return icons[iconName] || Bell;
  };

  const getColorByType = (type: string) => {
    const colorMap: Record<string, string> = {
      warning: "warning",
      success: "success",
      reminder: "primary",
      tip: "accent",
      goal: "success",
    };
    return colorMap[type] || "primary";
  };

  const colorClasses = {
    warning: "bg-warning/10 border-warning/20 hover:border-warning/40",
    success: "bg-success/10 border-success/20 hover:border-success/40",
    primary: "bg-primary/10 border-primary/20 hover:border-primary/40",
    accent: "bg-accent/10 border-accent/20 hover:border-accent/40",
  };

  const iconColorClasses = {
    warning: "text-warning",
    success: "text-success",
    primary: "text-primary",
    accent: "text-accent",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">{t("التنبيهات", "Notifications")}</h1>
            <p className="text-muted-foreground">{t("تابع التحديثات والتنبيهات الذكية", "Follow updates and smart alerts")}</p>
          </div>

          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">{t("لا توجد تنبيهات حالياً", "No notifications currently")}</h3>
              <p className="text-muted-foreground">{t("سنرسل لك التنبيهات المهمة هنا", "We'll send you important alerts here")}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => {
                const Icon = getIconComponent(notification.icon);
                const color = getColorByType(notification.type);
                const colorClass = colorClasses[color as keyof typeof colorClasses];
                const iconColorClass = iconColorClasses[color as keyof typeof iconColorClasses];
                const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
                  addSuffix: true,
                  locale: language === "ar" ? ar : enUS,
                });

                return (
                  <Card
                    key={notification.id}
                    className={`p-6 border-2 ${colorClass} transition-smooth hover:scale-105 animate-slide-up cursor-pointer`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-card ${iconColorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-lg">{notification.title}</h3>
                          <span className="text-sm text-muted-foreground">{timeAgo}</span>
                        </div>
                        <p className="text-muted-foreground">{notification.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;
