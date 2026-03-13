import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (newPassword.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Your password has been updated." });
      navigate(-1);
    }
  };

  const passwordFields = [
    { label: "Current Password", value: currentPassword, onChange: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent), placeholder: "Enter current password" },
    { label: "New Password", value: newPassword, onChange: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew), placeholder: "Min. 8 characters" },
    { label: "Confirm New Password", value: confirmPassword, onChange: setConfirmPassword, show: showNew, toggle: () => {}, placeholder: "Re-enter new password" },
  ];

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground font-heading">Change Password</h1>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {passwordFields.map((field) => (
          <div key={field.label}>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {field.label}
            </label>
            <div className="relative">
              <input
                type={field.show ? "text" : "password"}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-xl bg-muted px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
              />
              {field.label !== "Confirm New Password" && (
                <button
                  type="button"
                  onClick={field.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Password requirements */}
        <div className="rounded-xl bg-accent/50 p-3">
          <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Password requirements:</p>
          <ul className="flex flex-col gap-1">
            {[
              { met: newPassword.length >= 8, text: "At least 8 characters" },
              { met: /[A-Z]/.test(newPassword), text: "One uppercase letter" },
              { met: /[0-9]/.test(newPassword), text: "One number" },
              { met: newPassword === confirmPassword && confirmPassword.length > 0, text: "Passwords match" },
            ].map((req) => (
              <li key={req.text} className={`text-[11px] flex items-center gap-1.5 ${req.met ? "text-foreground" : "text-muted-foreground"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${req.met ? "bg-success" : "bg-border"}`} />
                {req.text}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !newPassword || !confirmPassword}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </MobileLayout>
  );
};

export default ChangePassword;
