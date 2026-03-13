import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Bell, Mail, Smartphone, MessageSquare, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const Toggle = ({ enabled, onToggle }: ToggleProps) => (
  <button
    onClick={onToggle}
    className={`relative h-7 w-12 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
  >
    <div
      className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform ${
        enabled ? "translate-x-5.5 left-0.5" : "left-0.5"
      }`}
      style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }}
    />
  </button>
);

const NotificationPreferences = () => {
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({
    pushBookings: true,
    pushMessages: true,
    pushPromotions: false,
    pushReminders: true,
    emailBookings: true,
    emailMessages: false,
    emailPromotions: false,
    emailNewsletter: false,
    smsBookings: true,
    smsReminders: true,
    smsPromotions: false,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    toast({ title: "Saved", description: "Notification preferences updated." });
    navigate(-1);
  };

  const sections = [
    {
      title: "Push Notifications",
      icon: Smartphone,
      items: [
        { key: "pushBookings" as const, label: "Booking updates", desc: "Confirmations, cancellations, changes" },
        { key: "pushMessages" as const, label: "Messages", desc: "New messages from traders" },
        { key: "pushReminders" as const, label: "Reminders", desc: "Upcoming appointment reminders" },
        { key: "pushPromotions" as const, label: "Promotions", desc: "Deals and special offers" },
      ],
    },
    {
      title: "Email Notifications",
      icon: Mail,
      items: [
        { key: "emailBookings" as const, label: "Booking confirmations", desc: "Receipts and booking details" },
        { key: "emailMessages" as const, label: "Message summaries", desc: "Daily digest of unread messages" },
        { key: "emailNewsletter" as const, label: "Newsletter", desc: "Tips, news, and product updates" },
        { key: "emailPromotions" as const, label: "Promotions", desc: "Exclusive offers and discounts" },
      ],
    },
    {
      title: "SMS Notifications",
      icon: MessageSquare,
      items: [
        { key: "smsBookings" as const, label: "Booking alerts", desc: "Booking confirmations via SMS" },
        { key: "smsReminders" as const, label: "Appointment reminders", desc: "Reminders before your booking" },
        { key: "smsPromotions" as const, label: "Marketing", desc: "Promotional messages" },
      ],
    },
  ];

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground font-heading">Notification Preferences</h1>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Info */}
        <div className="flex items-start gap-3 rounded-xl bg-accent/50 p-3">
          <Info className="h-4 w-4 mt-0.5 text-primary shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Choose how you want to be notified. You can change these at any time. Essential security notifications cannot be turned off.
          </p>
        </div>

        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <SectionIcon className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
              </div>
              <div className="rounded-2xl bg-card card-shadow overflow-hidden divide-y divide-border">
                {section.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle enabled={prefs[item.key]} onToggle={() => toggle(item.key)} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button
          onClick={handleSave}
          className="rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
        >
          Save Preferences
        </button>
      </div>
    </MobileLayout>
  );
};

export default NotificationPreferences;
