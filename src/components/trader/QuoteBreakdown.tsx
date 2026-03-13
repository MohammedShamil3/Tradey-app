import { useState, forwardRef, useImperativeHandle } from "react";
import { Plus, Trash2, PoundSterling, Package, Wrench } from "lucide-react";
import QuoteMessage, { type QuoteMessageData } from "./QuoteMessage";

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteBreakdownHandle {
  submit: () => void;
}

interface QuoteBreakdownProps {
  onSubmitQuote: (data: { materials: QuoteLineItem[]; labourHours: number; labourRate: number; total: number; message?: string; voiceNoteBlob?: Blob; voiceNoteDuration?: string }) => void;
}

const QuoteBreakdown = forwardRef<QuoteBreakdownHandle, QuoteBreakdownProps>(({ onSubmitQuote }, ref) => {
  const [materials, setMaterials] = useState<QuoteLineItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [labourHours, setLabourHours] = useState(1);
  const [labourRate, setLabourRate] = useState(45);
  const [quoteMsg, setQuoteMsg] = useState<QuoteMessageData>({ text: "" });

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
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const materialsTotal = materials.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0);
  const labourTotal = labourHours * labourRate;
  const grandTotal = materialsTotal + labourTotal;

  useImperativeHandle(ref, () => ({
    submit: () => {
      onSubmitQuote({
        materials, labourHours, labourRate, total: grandTotal,
        message: quoteMsg.text || undefined,
        voiceNoteBlob: quoteMsg.voiceNoteBlob,
        voiceNoteDuration: quoteMsg.voiceNoteDuration,
      });
    },
  }));

  return (
    <div className="px-4 py-3.5 border-b border-border space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Quote Breakdown
      </p>

      {/* Materials / Items */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold text-foreground">Materials &amp; Items</span>
        </div>

        {materials.map((item, idx) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold text-muted-foreground shrink-0">
                #{idx + 1}
              </span>
              {materials.length > 1 && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Item description"
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-[10px] text-muted-foreground">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] text-muted-foreground">Unit price (£)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.unitPrice || ""}
                  onChange={(e) => updateItem(item.id, "unitPrice", Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] text-muted-foreground">Subtotal</label>
                <div className="flex items-center rounded-lg border border-border bg-accent/40 px-3 py-2 text-xs font-semibold text-foreground">
                  £{(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>
      </div>

      {/* Labour */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Wrench className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold text-foreground">Labour</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] text-muted-foreground">Hours</label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={labourHours}
              onChange={(e) => setLabourHours(Math.max(0.5, Number(e.target.value)))}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[10px] text-muted-foreground">Rate (£/hr)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={labourRate}
              onChange={(e) => setLabourRate(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[10px] text-muted-foreground">Subtotal</label>
            <div className="flex items-center rounded-lg border border-border bg-accent/40 px-3 py-2 text-xs font-semibold text-foreground">
              £{labourTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Totals summary */}
      <div className="rounded-xl bg-accent/50 p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Materials &amp; Items</span>
          <span className="font-semibold text-foreground">£{materialsTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Labour ({labourHours}h × £{labourRate})</span>
          <span className="font-semibold text-foreground">£{labourTotal.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-1.5 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Total Quote</span>
          <span className="text-sm font-extrabold text-primary flex items-center gap-0.5">
            <PoundSterling className="h-3.5 w-3.5" />
            {grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Message to customer */}
      <QuoteMessage value={quoteMsg} onChange={setQuoteMsg} />
    </div>
  );
});

QuoteBreakdown.displayName = "QuoteBreakdown";

export default QuoteBreakdown;
