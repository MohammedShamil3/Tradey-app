import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Save, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const fields = [
  { key: "full_name", label: "Full Name", type: "text", placeholder: "John Doe" },
  { key: "email", label: "Email", type: "email", placeholder: "john@example.com" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+31 6 1234 5678" },
  { key: "date_of_birth", label: "Date of Birth", type: "date", placeholder: "" },
] as const;

const PersonalDetails = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    date_of_birth: profile?.date_of_birth || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile(form);
    setSaving(false);
    if (!error) {
      toast({ title: "Saved", description: "Personal details updated." });
      setEditing(false);
    } else {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setForm({
      full_name: profile?.full_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      date_of_birth: profile?.date_of_birth || "",
    });
    setEditing(false);
  };

  return (
    <MobileLayout>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground font-heading">Personal Details</h1>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary active:scale-95 transition-transform"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        )}
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {field.label}
            </label>
            {editing ? (
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full rounded-xl bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
              />
            ) : (
              <p className="rounded-xl bg-secondary/50 px-4 py-3 text-sm text-foreground">
                {form[field.key] || <span className="text-muted-foreground italic">Not set</span>}
              </p>
            )}
          </div>
        ))}

        {editing && (
          <div className="mt-2 flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-bold text-foreground transition-transform active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default PersonalDetails;
