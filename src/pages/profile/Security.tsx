import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Key, Smartphone, Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Security = () => {
  const navigate = useNavigate();

  const items = [
    { icon: Key, label: "Change Password", subtitle: "Update your account password", route: "/profile/security/password" },
    { icon: Smartphone, label: "Two-Factor Authentication", subtitle: "Add an extra layer of security", route: "/profile/security/2fa" },
    { icon: Lock, label: "Active Sessions", subtitle: "Manage your logged-in devices", route: "/profile/security/sessions" },
  ];

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground font-heading">Password & Security</h1>
      </div>
      <div className="px-4 py-5 flex flex-col gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow text-left active:bg-muted/60"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </MobileLayout>
  );
};

export default Security;
