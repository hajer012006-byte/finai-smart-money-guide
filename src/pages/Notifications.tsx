import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Bell, Zap, Target } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "warning",
      icon: AlertTriangle,
      title: "اقتربت من تجاوز ميزانيتك",
      description: "صرفت 80% من ميزانية الشهر. انتبه للإنفاق القادم.",
      time: "منذ ساعتين",
      color: "warning",
    },
    {
      id: 2,
      type: "success",
      icon: TrendingUp,
      title: "وفرت 300 جنيه أكثر من الشهر الماضي",
      description: "استمر على هذا النهج الرائع! 👏",
      time: "اليوم",
      color: "success",
    },
    {
      id: 3,
      type: "reminder",
      icon: Bell,
      title: "فاتورة الكهرباء قادمة",
      description: "فاضل أسبوع على موعد دفع الفاتورة (600 جنيه)",
      time: "أمس",
      color: "primary",
    },
    {
      id: 4,
      type: "tip",
      icon: Zap,
      title: "نصيحة ذكية",
      description: "لو قللت مصروف المطاعم 10%، هتحقق هدفك أسرع بشهر.",
      time: "منذ يومين",
      color: "accent",
    },
    {
      id: 5,
      type: "goal",
      icon: Target,
      title: "اقتربت من تحقيق هدفك",
      description: "بقى 2000 جنيه فقط لتحقيق هدف 'شراء لابتوب جديد'",
      time: "منذ 3 أيام",
      color: "success",
    },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">التنبيهات</h1>
            <p className="text-muted-foreground">تابع التحديثات والتنبيهات الذكية</p>
          </div>

          <div className="space-y-4">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              const colorClass = colorClasses[notification.color as keyof typeof colorClasses];
              const iconColorClass = iconColorClasses[notification.color as keyof typeof iconColorClasses];

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
                        <span className="text-sm text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
