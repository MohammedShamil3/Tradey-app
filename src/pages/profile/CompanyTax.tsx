import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Receipt, Save, Pencil, X, CheckCircle2, AlertCircle, Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TaxInfo {
  vatNumber: string;
  taxId: string;
  companyRegNumber: string;
  vatRegistered: boolean;
}

const fieldMeta = [
  { key: "vatNumber" as const, label: "VAT Number (BTW)", placeholder: "NL000000000B00", description: "Dutch BTW registration number" },
  { key: "taxId" as const, label: "Tax ID (RSIN)", placeholder: "RSIN 000000000", description: "Revenue Service identification" },
  { key: "companyRegNumber" as const, label: "Chamber of Commerce (KVK)", placeholder: "KVK 00000000", description: "Trade register number" },
];

const CompanyTax = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<TaxInfo>({
    vatNumber: "NL123456789B01",
    taxId: "RSIN 812345678",
    companyRegNumber: "KVK 12345678",
    vatRegistered: true,
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(saved);

  const handleSave = () => {
    setSaved({ ...form });
    setEditing(false);
    toast.success("Tax information updated");
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setEditing(false);
  };

  const allComplete = saved.vatNumber && saved.taxId && saved.companyRegNumber;

  return (
    <MobileLayout role="trader">
      <div className="px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-foreground font-heading">Tax & Compliance</h1>
            <p className="text-xs text-muted-foreground">Company tax registration details</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 transition-colors active:bg-primary/20"
            >
              <Pencil className="h-4 w-4 text-primary" />
            </button>
          )}
        </div>

        {/* Overall status */}
        <div className={`mb-5 flex items-center gap-3 rounded-2xl p-4 ${allComplete ? "bg-primary/5 border border-primary/10" : "bg-destructive/5 border border-destructive/15"}`}>
          {allComplete ? (
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
          )}
          <div>
            <p className={`text-sm font-bold ${allComplete ? "text-primary" : "text-destructive"}`}>
              {allComplete ? "Tax Details Complete" : "Incomplete — Action Required"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {allComplete
                ? "All required tax information has been provided."
                : "Some tax details are missing. Tap edit to update."}
            </p>
          </div>
        </div>

        {/* Tax details — View mode */}
        {!editing && (
          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Registration Details</h3>
            <div className="rounded-2xl bg-card card-shadow overflow-hidden">
              {fieldMeta.map((field, i) => {
                const value = saved[field.key];
                const hasValue = !!value;
                return (
                  <div
                    key={field.key}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i < fieldMeta.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${hasValue ? "bg-primary/10" : "bg-destructive/10"}`}>
                      {hasValue ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-muted-foreground">{field.label}</p>
                      <p className={`text-sm font-bold truncate ${hasValue ? "text-foreground" : "text-destructive"}`}>
                        {value || "Not provided"}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* VAT Registered */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-t border-border">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${saved.vatRegistered ? "bg-primary/10" : "bg-muted"}`}>
                  {saved.vatRegistered ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-muted-foreground">VAT Registered</p>
                  <p className="text-sm font-bold text-foreground">{saved.vatRegistered ? "Yes — BTW Registered" : "No"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tax details — Edit mode */}
        {editing && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Edit Details</h3>
              <button
                onClick={handleCancel}
                className="text-xs font-semibold text-muted-foreground transition-colors active:text-foreground"
              >
                Cancel
              </button>
            </div>

            {fieldMeta.map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{field.label}</label>
                <div className="flex items-center rounded-2xl border-2 border-primary/30 bg-card px-4 py-3 transition-colors focus-within:border-primary">
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{field.description}</p>
              </div>
            ))}

            {/* VAT toggle */}
            <div className="flex items-center justify-between rounded-2xl border-2 border-primary/30 bg-card p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">VAT Registered</p>
                <p className="text-[11px] text-muted-foreground">Is your company BTW registered?</p>
              </div>
              <button
                onClick={() => setForm({ ...form, vatRegistered: !form.vatRegistered })}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  form.vatRegistered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {form.vatRegistered ? "Yes" : "No"}
              </button>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-5 flex items-start gap-2 rounded-2xl bg-accent/50 p-4">
          <Shield className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tax details are used for invoicing and compliance with Dutch tax regulations (Belastingdienst). 
            Ensure your KVK and BTW numbers are accurate and up to date.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CompanyTax;
