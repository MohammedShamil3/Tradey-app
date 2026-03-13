import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, CheckCircle2, Clock, Send, ChevronDown, Calendar,
  Settings, Zap, CalendarClock, AlertCircle, PoundSterling, AlertTriangle,
} from "lucide-react";
import Avatar from "boring-avatars";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

interface PaycheckLine {
  service: string;
  icon: string;
  hours: number;
  basePay: number;
  total: number;
}

interface MemberPaycheck {
  memberId: string;
  name: string;
  email: string;
  lines: PaycheckLine[];
  totalHours: number;
  totalAmount: number;
  status: "draft" | "processing" | "paid";
}

const mockPaychecks: MemberPaycheck[] = [
  {
    memberId: "m1",
    name: "Alex Turner",
    email: "alex@example.com",
    lines: [
      { service: "Tap Repair", icon: "🔧", hours: 6, basePay: 30, total: 180 },
      { service: "Drain Unblocking", icon: "🚿", hours: 4.5, basePay: 30, total: 135 },
      { service: "Toilet Repair", icon: "🔧", hours: 4, basePay: 30, total: 120 },
    ],
    totalHours: 14.5,
    totalAmount: 435,
    status: "draft",
  },
  {
    memberId: "m2",
    name: "James Cooper",
    email: "james@example.com",
    lines: [
      { service: "Tap Repair", icon: "🔧", hours: 4, basePay: 30, total: 120 },
      { service: "Drain Unblocking", icon: "🚿", hours: 3, basePay: 30, total: 90 },
    ],
    totalHours: 7,
    totalAmount: 210,
    status: "draft",
  },
];

const previousPaychecks: { name: string; period: string; totalHours: number; totalAmount: number; paidOn: string }[] = [
  { name: "Alex Turner", period: "24 Feb – 2 Mar", totalHours: 18, totalAmount: 540, paidOn: "3 Mar 2026" },
  { name: "James Cooper", period: "24 Feb – 2 Mar", totalHours: 12, totalAmount: 360, paidOn: "3 Mar 2026" },
  { name: "Alex Turner", period: "17 Feb – 23 Feb", totalHours: 16, totalAmount: 480, paidOn: "24 Feb 2026" },
  { name: "James Cooper", period: "17 Feb – 23 Feb", totalHours: 10, totalAmount: 300, paidOn: "24 Feb 2026" },
];

type PayoutSchedule = "manual" | "weekly" | "biweekly" | "monthly";

const scheduleLabels: Record<PayoutSchedule, string> = {
  manual: "Manual Only",
  weekly: "Every Friday",
  biweekly: "Every 2nd Friday",
  monthly: "1st of Each Month",
};

const Paychecks = () => {
  const navigate = useNavigate();
  const [paychecks, setPaychecks] = useState(mockPaychecks);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"current" | "history" | "settings">("current");
  const [payoutSchedule, setPayoutSchedule] = useState<PayoutSchedule>("weekly");
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: "single" | "all"; memberId?: string } | null>(null);
  const [skippedWeeks, setSkippedWeeks] = useState<Set<string>>(new Set());

  const grandTotal = paychecks.reduce((s, p) => s + p.totalAmount, 0);
  const draftCount = paychecks.filter((p) => p.status === "draft").length;

  const executePayout = (memberId: string) => {
    setPaychecks((prev) =>
      prev.map((p) => (p.memberId === memberId ? { ...p, status: "processing" as const } : p))
    );
    toast.success("Payment initiated!", { description: "Funds will be transferred within 1-2 business days." });
    setTimeout(() => {
      setPaychecks((prev) =>
        prev.map((p) => (p.memberId === memberId && p.status === "processing" ? { ...p, status: "paid" as const } : p))
      );
    }, 2000);
  };

  const executeAllPayouts = () => {
    setPaychecks((prev) => prev.map((p) => p.status === "draft" ? { ...p, status: "processing" as const } : p));
    toast.success("All payments initiated! 🎉", { description: "Funds will be transferred within 1-2 business days." });
    setTimeout(() => {
      setPaychecks((prev) => prev.map((p) => p.status === "processing" ? { ...p, status: "paid" as const } : p));
    }, 2000);
  };

  const triggerPayout = (memberId: string) => {
    if (payoutSchedule !== "manual") {
      setConfirmAction({ type: "single", memberId });
    } else {
      executePayout(memberId);
    }
  };

  const triggerAllPayouts = () => {
    if (payoutSchedule !== "manual") {
      setConfirmAction({ type: "all" });
    } else {
      executeAllPayouts();
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    // Mark this week's auto-pay as skipped
    const weekKey = new Date().toISOString().slice(0, 10);
    setSkippedWeeks((prev) => new Set(prev).add(weekKey));

    if (confirmAction.type === "single" && confirmAction.memberId) {
      executePayout(confirmAction.memberId);
    } else {
      executeAllPayouts();
    }
    setConfirmAction(null);
    toast("Auto-pay skipped for this week", { description: "This week's scheduled payout has been cancelled since you paid manually." });
  };

  return (
    <MobileLayout role="trader">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-2 pt-6">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground font-heading">Worker Payouts</h1>
          <p className="text-xs text-muted-foreground">
            {payoutSchedule === "manual" ? "Manual payouts" : `Auto: ${scheduleLabels[payoutSchedule]}`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-4 mb-4 flex gap-1 rounded-xl bg-muted p-1">
        {(["current", "history", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2 text-[10px] font-semibold transition-all ${
              tab === t ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
            }`}
          >
            {t === "current" ? "Current" : t === "history" ? "History" : "Schedule"}
          </button>
        ))}
      </div>

      <div className="px-4 pb-6">
        {/* ── Current Tab ── */}
        {tab === "current" && (
          <div className="flex flex-col gap-3">
            {/* Summary card */}
            <div className="rounded-2xl bg-primary p-4 card-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-primary-foreground/70 uppercase">Total Payroll</p>
                  <p className="mt-0.5 text-3xl font-extrabold text-primary-foreground">£{grandTotal}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-primary-foreground/70">{paychecks.length} workers</p>
                  <p className="text-sm font-bold text-primary-foreground">
                    {paychecks.reduce((s, p) => s + p.totalHours, 0)}h total
                  </p>
                </div>
              </div>
              {draftCount > 0 && (
                <button
                  onClick={triggerAllPayouts}
                  className="mt-3 w-full rounded-xl bg-primary-foreground/20 py-2.5 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
                >
                  <Zap className="mr-1.5 inline h-3.5 w-3.5" />
                  Pay All Workers Now ({draftCount})
                </button>
              )}
              {draftCount === 0 && (
                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-primary-foreground/10 py-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground/70" />
                  <span className="text-xs font-semibold text-primary-foreground/70">All payments complete</span>
                </div>
              )}
            </div>

            {/* Auto schedule info */}
            {payoutSchedule !== "manual" && draftCount > 0 && (
              <div className="flex items-center gap-2 rounded-2xl bg-accent/50 border border-border px-3.5 py-3">
                <CalendarClock className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs text-foreground">
                  <span className="font-semibold">Auto-pay:</span> {scheduleLabels[payoutSchedule]}. 
                  <span className="text-muted-foreground"> Or trigger manually below.</span>
                </p>
              </div>
            )}

            {/* Individual paychecks */}
            {paychecks.map((paycheck) => {
              const isExpanded = expandedId === paycheck.memberId;
              return (
                <div key={paycheck.memberId} className="rounded-2xl bg-card card-shadow overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : paycheck.memberId)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <Avatar size={40} name={paycheck.name} variant="beam" colors={avatarPalette} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{paycheck.name}</h4>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{paycheck.totalHours}h worked</span>
                        <span>·</span>
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          paycheck.status === "paid" ? "bg-primary/10 text-primary" :
                          paycheck.status === "processing" ? "bg-yellow-500/10 text-yellow-600" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {paycheck.status === "processing" ? "Processing" : paycheck.status === "paid" ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-extrabold text-primary">£{paycheck.totalAmount}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border">
                      {/* Line items */}
                      <div className="px-4 py-3">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Breakdown</p>
                        {paycheck.lines.map((line, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{line.icon}</span>
                              <div>
                                <p className="text-xs font-semibold text-foreground">{line.service}</p>
                                <p className="text-[10px] text-muted-foreground">{line.hours}h × £{line.basePay}/hr</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-foreground">£{line.total}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-2 mt-1">
                          <span className="text-xs font-bold text-muted-foreground">Total</span>
                          <span className="text-sm font-extrabold text-primary">£{paycheck.totalAmount}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex border-t border-border">
                        {paycheck.status === "draft" && (
                          <button
                            onClick={() => triggerPayout(paycheck.memberId)}
                            className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary transition-colors active:bg-accent"
                          >
                            <Zap className="h-3.5 w-3.5" /> Pay Now
                          </button>
                        )}
                        {paycheck.status === "processing" && (
                          <div className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-yellow-600">
                            <Clock className="h-3.5 w-3.5 animate-spin" /> Processing...
                          </div>
                        )}
                        {paycheck.status === "paid" && (
                          <div className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary/60">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                          </div>
                        )}
                        <div className="w-px bg-border" />
                        <button
                          onClick={() => navigate(`/trader/member-payouts/${paycheck.memberId}`)}
                          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-muted-foreground transition-colors active:bg-accent"
                        >
                          <PoundSterling className="h-3.5 w-3.5" /> History
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── History Tab ── */}
        {tab === "history" && (
          <div className="flex flex-col gap-2.5">
            {previousPaychecks.map((p, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow">
                <Avatar size={36} name={p.name} variant="beam" colors={avatarPalette} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-foreground truncate">{p.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span><Calendar className="mr-0.5 inline h-3 w-3" />{p.period}</span>
                    <span>·</span>
                    <span>{p.totalHours}h</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Paid on {p.paidOn}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-primary">£{p.totalAmount}</p>
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">Paid</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Schedule Settings Tab ── */}
        {tab === "settings" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-card card-shadow overflow-hidden">
              <div className="p-4">
                <h3 className="text-sm font-bold text-foreground mb-1">Payout Schedule</h3>
                <p className="text-[11px] text-muted-foreground mb-4">
                  Choose how worker payments are processed. You can always trigger manual payouts regardless of the schedule.
                </p>

                <div className="flex flex-col gap-2">
                  {(Object.entries(scheduleLabels) as [PayoutSchedule, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setPayoutSchedule(key);
                        toast.success(`Payout schedule set to: ${label}`);
                      }}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3.5 transition-all ${
                        payoutSchedule === key
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        payoutSchedule === key ? "bg-primary/10" : "bg-muted"
                      }`}>
                        {key === "manual" ? (
                          <Zap className={`h-4 w-4 ${payoutSchedule === key ? "text-primary" : "text-muted-foreground"}`} />
                        ) : (
                          <CalendarClock className={`h-4 w-4 ${payoutSchedule === key ? "text-primary" : "text-muted-foreground"}`} />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-semibold ${payoutSchedule === key ? "text-primary" : "text-foreground"}`}>
                          {key === "manual" ? "Manual Only" : key === "weekly" ? "Weekly" : key === "biweekly" ? "Bi-weekly" : "Monthly"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {key === "manual"
                            ? "You trigger each payout manually"
                            : `Auto-pay ${label.toLowerCase()}`}
                        </p>
                      </div>
                      {payoutSchedule === key && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 rounded-2xl bg-accent/50 p-4">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Auto-pay</span> will process all pending worker payments on the scheduled day. 
                You can still trigger individual or bulk payouts manually at any time from the Current tab. 
                Payments are deducted from your company account.
              </p>
            </div>

            {payoutSchedule !== "manual" && (
              <div className="rounded-2xl bg-card p-4 card-shadow">
                <h4 className="text-sm font-bold text-foreground mb-2">Next Auto-Payout</h4>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {payoutSchedule === "weekly" ? "Friday, 14 Mar 2026" : payoutSchedule === "biweekly" ? "Friday, 21 Mar 2026" : "1 Apr 2026"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Estimated total: £{grandTotal}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual payout confirmation dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent className="max-w-[340px] rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-base font-bold">
              Skip This Week's Auto-Pay?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xs leading-relaxed">
              You have <span className="font-semibold text-foreground">{scheduleLabels[payoutSchedule]}</span> auto-pay enabled. 
              Triggering a manual payout will <span className="font-semibold text-foreground">cancel this week's scheduled payment</span> to 
              avoid duplicate transfers.
              <br /><br />
              The automatic schedule will resume next cycle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={handleConfirm}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              <Zap className="mr-1.5 inline h-3.5 w-3.5" />
              Pay Now & Skip Auto-Pay
            </AlertDialogAction>
            <AlertDialogCancel className="w-full rounded-xl border-border py-3 text-sm font-semibold">
              Keep Scheduled
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
};

export default Paychecks;
