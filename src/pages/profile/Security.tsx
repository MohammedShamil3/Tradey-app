import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Key, Smartphone, Lock, ChevronRight, Fingerprint } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Security = () => {
  const navigate = useNavigate();
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);

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

        {/* Fingerprint Toggle */}
        <button
          onClick={() => {
            setFingerprintEnabled(!fingerprintEnabled);
            toast.success(fingerprintEnabled ? "Fingerprint sign-in disabled" : "Fingerprint sign-in enabled");
          }}
          className={`flex items-center gap-3 rounded-2xl p-4 card-shadow text-left transition-all active:scale-[0.99] ${
            fingerprintEnabled ? "bg-primary/5 border-2 border-primary" : "bg-card border-2 border-transparent"
          }`}
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            fingerprintEnabled ? "bg-primary" : "bg-accent"
          }`}>
            <Fingerprint className={`h-5 w-5 ${fingerprintEnabled ? "text-primary-foreground" : "text-primary"}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Sign in with Fingerprint</p>
            <p className="text-[11px] text-muted-foreground">Use biometric authentication to sign in quickly</p>
          </div>
          <div className={`flex h-6 w-10 shrink-0 items-center rounded-full px-0.5 transition-all ${
            fingerprintEnabled ? "bg-primary justify-end" : "bg-muted justify-start"
          }`}>
            <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
          </div>
        </button>
      </div>
    </MobileLayout>
  );
};

export default Security;
