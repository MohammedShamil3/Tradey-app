import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Landmark, Plus, CheckCircle2, Building2, Shield, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PayoutMethod {
  id: string;
  type: "bank";
  label: string;
  lastFour: string;
  bankName: string;
  isDefault: boolean;
}

const companyMethods: PayoutMethod[] = [
  { id: "pm1", type: "bank", label: "Company Current Account", lastFour: "4821", bankName: "ING Bank", isDefault: true },
];

const personalMethods: PayoutMethod[] = [
  { id: "pm1", type: "bank", label: "Personal Current Account", lastFour: "7392", bankName: "ABN AMRO", isDefault: true },
];

const Payouts = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isAgency = profile?.trader_type === "agency";
  const [methods, setMethods] = useState(isAgency ? companyMethods : personalMethods);
  const [showAdd, setShowAdd] = useState(false);
  const [iban, setIban] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bic, setBic] = useState("");

  const setDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    toast.success("Primary account updated");
  };

  const addMethod = () => {
    if (!iban.trim() || !accountName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const newMethod: PayoutMethod = {
      id: `pm-${Date.now()}`,
      type: "bank",
      label: accountName.trim(),
      lastFour: iban.slice(-4),
      bankName: "Bank Account",
      isDefault: methods.length === 0,
    };
    setMethods((prev) => [...prev, newMethod]);
    setShowAdd(false);
    setIban("");
    setAccountName("");
    setBic("");
    toast.success("Bank account added");
  };

  return (
    <MobileLayout role="trader">
      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-foreground font-heading">{isAgency ? "Company Bank Account" : "Bank Account"}</h1>
            <p className="text-xs text-muted-foreground">{isAgency ? "Where your business income is received" : "Where your earnings are paid"}</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-4 flex items-start gap-2 rounded-2xl bg-primary/5 border border-primary/10 p-3.5">
          {isAgency ? <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" /> : <User className="h-4 w-4 mt-0.5 shrink-0 text-primary" />}
          <p className="text-xs text-foreground leading-relaxed">
            {isAgency
              ? "All customer payments for completed jobs will be deposited into your primary bank account. You can add multiple accounts and set a default."
              : "Your earnings from completed jobs will be deposited into your bank account. You can add multiple accounts and set a default."}
          </p>
        </div>

        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Linked Accounts</h3>

        <div className="flex flex-col gap-2.5">
          {methods.map((method) => (
            <div key={method.id} className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{method.label}</h3>
                  {method.isDefault && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">Primary</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{method.bankName} · ····{method.lastFour}</p>
              </div>
              {!method.isDefault && (
                <button
                  onClick={() => setDefault(method.id)}
                  className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-[10px] font-semibold text-secondary-foreground"
                >
                  Set Primary
                </button>
              )}
              {method.isDefault && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              )}
            </div>
          ))}
        </div>

        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-semibold text-muted-foreground transition-colors active:bg-muted/50"
          >
            <Plus className="h-4 w-4" />
            Add Bank Account
          </button>
        ) : (
          <div className="mt-4 rounded-2xl bg-card p-4 card-shadow">
            <h3 className="mb-3 text-sm font-bold text-foreground">{isAgency ? "Add Company Bank Account" : "Add Bank Account"}</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Account Name</label>
                <div className="flex items-center rounded-2xl border border-border bg-background px-4 py-3">
                  <input
                    type="text"
                    placeholder={isAgency ? "My Company B.V." : "John Doe"}
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">IBAN</label>
                <div className="flex items-center rounded-2xl border border-border bg-background px-4 py-3">
                  <input
                    type="text"
                    placeholder="NL00 INGB 0000 0000 00"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">BIC / SWIFT (Optional)</label>
                <div className="flex items-center rounded-2xl border border-border bg-background px-4 py-3">
                  <input
                    type="text"
                    placeholder="INGBNL2A"
                    value={bic}
                    onChange={(e) => setBic(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowAdd(false); setIban(""); setAccountName(""); setBic(""); }}
                  className="flex-1 rounded-xl bg-secondary py-3 text-sm font-semibold text-secondary-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={addMethod}
                  className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security note */}
        <div className="mt-5 flex items-start gap-2 rounded-2xl bg-accent/50 p-4">
          <Shield className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAgency
              ? "Bank details are encrypted and stored securely. Only verified company accounts can receive payouts."
              : "Bank details are encrypted and stored securely. Only verified accounts can receive payouts."}
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Payouts;
