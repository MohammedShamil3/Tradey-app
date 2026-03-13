import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Pencil, Save, User, MapPin, ChevronRight, Plus, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAddressStore, SavedAddress } from "@/stores/addressStore";

const personalFields = [
  { key: "full_name", label: "Full Name", type: "text", placeholder: "John Doe" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+31 6 1234 5678" },
  { key: "date_of_birth", label: "Date of Birth", type: "date", placeholder: "" },
] as const;

const traderPersonalFields = [
  { key: "full_name", label: "Full Name", type: "text", placeholder: "John Doe" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+31 6 1234 5678" },
  { key: "date_of_birth", label: "Date of Birth", type: "date", placeholder: "" },
  { key: "street", label: "Address", type: "text", placeholder: "123 Main Street" },
  { key: "postcode", label: "Postcode", type: "text", placeholder: "1012 AB" },
  { key: "city", label: "City", type: "text", placeholder: "Amsterdam" },
] as const;

const MyDetails = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const { addresses, removeAddress, setDefault } = useAddressStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const isTrader = profile?.role === "trader";

  const getInitialForm = () => ({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    date_of_birth: profile?.date_of_birth || "",
    street: profile?.street || "",
    postcode: profile?.postcode || "",
    city: profile?.city || "",
  });

  const [form, setForm] = useState(getInitialForm);

  useEffect(() => {
    setForm(getInitialForm());
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const updateData: any = {
      full_name: form.full_name,
      phone: form.phone,
      date_of_birth: form.date_of_birth,
    };
    if (isTrader) {
      updateData.street = form.street;
      updateData.postcode = form.postcode;
      updateData.city = form.city;
    }
    const { error } = await updateProfile(updateData);
    setSaving(false);
    if (!error) {
      toast({ title: "Saved", description: "Your details have been updated." });
      setEditing(false);
    } else {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  const handleCancel = () => {
    setForm(getInitialForm());
    setEditing(false);
  };

  const renderField = (field: { key: string; label: string; type?: string; placeholder: string }) => (
    <div key={field.key} className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-xs text-muted-foreground shrink-0 pt-0.5 min-w-[90px]">{field.label}</span>
      {editing ? (
        <input
          type={field.type || "text"}
          value={(form as any)[field.key]}
          onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
          placeholder={field.placeholder}
          className="flex-1 text-right rounded-lg bg-muted px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
        />
      ) : (
        <span className="flex-1 text-right text-sm font-medium text-foreground">
          {(form as any)[field.key] || <span className="text-muted-foreground italic font-normal">Not set</span>}
        </span>
      )}
    </div>
  );

  const fields = isTrader ? traderPersonalFields : personalFields;

  return (
    <MobileLayout role={isTrader ? "trader" : "customer"}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground font-heading">My Details</h1>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Personal Details (for traders includes address inline) */}
        <div className="rounded-2xl bg-card card-shadow overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Personal Details</h3>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary active:scale-95 transition-transform"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
            ) : null}
          </div>
          <div className="px-4 pb-3 divide-y divide-border">
            {fields.map(renderField)}
          </div>
          {editing && (
            <div className="flex gap-3 px-4 pb-4">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-foreground transition-transform active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* Addresses — only for customers */}
        {!isTrader && (
          <div className="rounded-2xl bg-card card-shadow overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Addresses</h3>
            </div>
            <div className="px-4 pb-3 flex flex-col gap-2">
              {addresses.length === 0 ? (
                <button
                  onClick={() => navigate("/profile/address")}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 py-3 text-xs font-semibold text-primary transition-transform active:scale-[0.98]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add an address
                </button>
              ) : (
                <>
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`rounded-xl p-3 transition-all ${
                        addr.isDefault
                          ? "bg-primary/5 border border-primary/20"
                          : "bg-secondary/30 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-foreground">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold text-primary">Default</span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{addr.street}</p>
                          <p className="text-[10px] text-muted-foreground">{addr.postcode} {addr.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 ml-11">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefault(addr.id)}
                            className="rounded-lg bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground transition-transform active:scale-95"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => navigate("/profile/address")}
                          className="flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground transition-transform active:scale-95"
                        >
                          <Pencil className="h-2.5 w-2.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            removeAddress(addr.id);
                            toast({ title: "Removed", description: "Address deleted." });
                          }}
                          className="flex items-center gap-1 rounded-lg bg-destructive/10 px-2.5 py-1 text-[10px] font-semibold text-destructive transition-transform active:scale-95"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/profile/address")}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 py-2.5 text-xs font-semibold text-primary transition-transform active:scale-[0.98] mt-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add new address
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default MyDetails;
