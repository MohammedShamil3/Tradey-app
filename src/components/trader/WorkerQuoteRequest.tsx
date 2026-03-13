import { useState } from "react";
import { Plus, Trash2, Send, Building2, CheckCircle2, Clock, MapPin, Mic, AlertTriangle, FileText, Eye, EyeOff, Wrench } from "lucide-react";

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface JobDetails {
  description: string;
  timeWindow: string;
  urgency: string | null;
  postedAgo: string;
  hasVoiceNote?: boolean;
  voiceDuration?: string;
  customerName: string;
  location: string;
  images?: string[];
}

interface WorkerQuoteRequestProps {
  jobTitle: string;
  companyName: string;
  jobIcon: string;
  jobDetails?: JobDetails;
  basePayRate?: number; // Agency-set hourly rate (read-only)
  onSubmit: (materials: QuoteLineItem[], materialsTotal: number, labourHours?: number, labourTotal?: number) => void;
  onCancel: () => void;
}

const maskName = (name: string) => {
  const parts = name.split(" ");
  return parts.map((p) => p[0] + "***").join(" ");
};

const maskAddress = (address: string) => {
  const parts = address.split(",").map((s) => s.trim());
  if (parts.length <= 1) return "*****, " + parts[0];
  return parts.map((p, i) => (i < parts.length - 1 ? "*****" : p)).join(", ");
};

const WorkerQuoteRequest = ({ jobTitle, companyName, jobIcon, jobDetails, basePayRate, onSubmit, onCancel }: WorkerQuoteRequestProps) => {
  const [materials, setMaterials] = useState<QuoteLineItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const addItem = () => {
    setMaterials((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (materials.length <= 1) return;
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteLineItem, value: string | number) => {
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const materialsTotal = materials.reduce((s, m) => s + m.quantity * m.unitPrice, 0);
  const labourTotal = basePayRate ? estimatedHours * basePayRate : 0;
  const grandTotal = materialsTotal + labourTotal;

  const handleSubmit = () => {
    const validItems = materials.filter((m) => m.description.trim() && m.unitPrice > 0);
    if (validItems.length === 0 && !basePayRate) return;
    setSubmitted(true);
    onSubmit(validItems, materialsTotal, basePayRate ? estimatedHours : undefined, basePayRate ? labourTotal : undefined);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Estimate Submitted</h3>
        <p className="text-[11px] text-muted-foreground">
          Your estimate of <span className="font-bold text-foreground">£{grandTotal.toFixed(2)}</span> has been sent to <span className="font-semibold text-primary">{companyName}</span> for review.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 bg-primary/5 px-4 py-3 border-b border-primary/10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
          {jobIcon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground truncate">{jobTitle}</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-primary">
            <Building2 className="h-3 w-3" />
            <span className="font-semibold">{companyName}</span>
            <span className="text-muted-foreground">· Quote Request</span>
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      {jobDetails && (
        <div className="border-b border-primary/10">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left"
          >
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-3 w-3" /> Job Details
            </span>
            {showDetails ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>

          {showDetails && (
            <div className="px-4 pb-3 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {jobDetails.timeWindow}
                </span>
                {jobDetails.urgency && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-2 py-1 text-[10px] font-semibold text-destructive">
                    <AlertTriangle className="h-3 w-3" /> {jobDetails.urgency}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground">Posted {jobDetails.postedAgo}</span>
              </div>

              <div className="rounded-xl bg-muted/40 border border-border p-2.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <span className="text-[10px] text-muted-foreground w-16 shrink-0">Customer</span>
                  <span className="font-medium">{maskName(jobDetails.customerName)}</span>
                  <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">Masked</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <span className="text-[10px] text-muted-foreground w-16 shrink-0">Location</span>
                  <span className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {maskAddress(jobDetails.location)}
                  </span>
                </div>
              </div>

              {jobDetails.description && (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer Message</p>
                  <p className="text-xs text-foreground leading-relaxed bg-muted/30 rounded-xl p-3 border border-border">
                    {jobDetails.description}
                  </p>
                </div>
              )}

              {jobDetails.hasVoiceNote && (
                <button className="flex w-full items-center gap-3 rounded-xl bg-muted/30 border border-border px-3.5 py-3 transition-colors active:bg-accent">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Mic className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[11px] font-semibold text-foreground leading-tight">Voice Note from Customer</p>
                    <p className="text-[10px] text-muted-foreground">{jobDetails.voiceDuration || "0:15"}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[3, 5, 8, 4, 7, 6, 3, 5, 7, 4, 6, 3].map((h, i) => (
                      <div key={i} className="w-[2px] rounded-full bg-primary/40" style={{ height: `${h * 1.5}px` }} />
                    ))}
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Labour — base pay from agency (read-only rate) */}
        {basePayRate && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Labour Cost</span>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Base Pay Rate (set by {companyName})</span>
                  <span className="text-xs font-bold text-foreground">£{basePayRate.toFixed(2)}/hr</span>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">Estimated Hours</label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Math.max(0.5, Number(e.target.value)))}
                    className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-[11px] font-semibold text-muted-foreground">Labour Subtotal</span>
                  <span className="text-xs font-bold text-primary">£{labourTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Materials & Items Estimate
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Add the items/materials you estimate are needed for this job.
        </p>

        {/* Material items */}
        <div className="space-y-2">
          {materials.map((item, idx) => (
            <div key={item.id} className="rounded-xl border border-border bg-muted/20 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Item #{idx + 1}</span>
                {materials.length > 1 && (
                  <button onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. Copper pipes (2m)"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] text-muted-foreground">Qty</label>
                  <input
                    type="number" min={1} value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-muted-foreground">Unit £</label>
                  <input
                    type="number" min={0} step={0.01} value={item.unitPrice || ""}
                    onChange={(e) => updateItem(item.id, "unitPrice", Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-muted-foreground">Subtotal</label>
                  <div className="rounded-lg border border-border bg-accent/40 px-2.5 py-1.5 text-xs font-semibold text-foreground">
                    £{(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add item
          </button>
        </div>

        {/* Total */}
        <div className="rounded-xl bg-accent/50 p-3 space-y-1.5">
          {basePayRate && (
            <>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Labour ({estimatedHours}h × £{basePayRate}/hr)</span>
                <span className="font-semibold text-foreground">£{labourTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Materials & Items</span>
                <span className="font-semibold text-foreground">£{materialsTotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-1.5" />
            </>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Estimated Total</span>
            <span className="text-sm font-extrabold text-primary">£{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-muted-foreground active:bg-muted"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={grandTotal <= 0}
            className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            Send Estimate
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerQuoteRequest;
