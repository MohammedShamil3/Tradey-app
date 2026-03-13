import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PoundSterling, Calendar, CheckCircle2, Clock, XCircle, ChevronRight } from "lucide-react";
import Avatar from "boring-avatars";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  hours: number;
  jobTitle: string;
  status: "paid" | "pending" | "failed";
}

const mockMemberPayments: Record<string, { name: string; totalPaid: number; pendingAmount: number; payments: PaymentRecord[] }> = {
  m1: {
    name: "Alex Turner",
    totalPaid: 2520,
    pendingAmount: 130,
    payments: [
      { id: "p1", date: "5 Mar 2026", amount: 45, hours: 1.5, jobTitle: "Tap Repair - 12 Oak Lane", status: "paid" },
      { id: "p2", date: "28 Feb 2026", amount: 30, hours: 1, jobTitle: "Toilet Repair - 22 Pine Rd", status: "paid" },
      { id: "p3", date: "20 Feb 2026", amount: 45, hours: 1.5, jobTitle: "Tap Repair - 3 Birch Close", status: "paid" },
      { id: "p4", date: "8 Mar 2026", amount: 60, hours: 2, jobTitle: "Drain Unblocking - 9 River St", status: "pending" },
      { id: "p5", date: "15 Feb 2026", amount: 30, hours: 1, jobTitle: "Pipe Inspection - 7 Hill Ave", status: "paid" },
    ],
  },
  m2: {
    name: "James Cooper",
    totalPaid: 1740,
    pendingAmount: 0,
    payments: [
      { id: "p6", date: "3 Mar 2026", amount: 50, hours: 2, jobTitle: "Drain Unblocking - 8 Elm St", status: "paid" },
      { id: "p7", date: "25 Feb 2026", amount: 0, hours: 0, jobTitle: "Boiler Service - 5 Maple Ave", status: "failed" },
      { id: "p8", date: "18 Feb 2026", amount: 60, hours: 2, jobTitle: "Leak Repair - 14 Garden Rd", status: "paid" },
    ],
  },
};

const statusConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  paid: { icon: CheckCircle2, label: "Paid", color: "text-primary", bg: "bg-primary/10" },
  pending: { icon: Clock, label: "Pending", color: "text-yellow-600", bg: "bg-yellow-50" },
  failed: { icon: XCircle, label: "Failed", color: "text-destructive", bg: "bg-destructive/10" },
};

const MemberPayouts = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const data = mockMemberPayments[memberId || "m1"] || mockMemberPayments.m1;

  return (
    <MobileLayout role="trader">
      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <Avatar size={36} name={data.name} variant="beam" colors={avatarPalette} />
            <div>
              <h1 className="text-lg font-extrabold text-foreground font-heading">{data.name}</h1>
              <p className="text-xs text-muted-foreground">Payment History</p>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="rounded-2xl bg-card p-3.5 card-shadow">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Paid</p>
            <p className="text-xl font-extrabold text-foreground">£{data.totalPaid.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-card p-3.5 card-shadow">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Pending</p>
            <p className="text-xl font-extrabold text-foreground">£{data.pendingAmount}</p>
          </div>
        </div>

        {/* Payment list */}
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Transactions</h3>
        <div className="flex flex-col gap-2">
          {data.payments.map((payment) => {
            const sc = statusConfig[payment.status];
            const StatusIcon = sc.icon;
            return (
              <div key={payment.id} className="flex items-center gap-3 rounded-2xl bg-card p-3.5 card-shadow">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sc.bg}`}>
                  <StatusIcon className={`h-4 w-4 ${sc.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{payment.jobTitle}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" />{payment.date}</span>
                    {payment.hours > 0 && <span>· {payment.hours}h</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-extrabold ${payment.status === "failed" ? "text-destructive" : "text-foreground"}`}>
                    {payment.status === "failed" ? "—" : `£${payment.amount}`}
                  </p>
                  <span className={`text-[9px] font-bold ${sc.color}`}>{sc.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default MemberPayouts;
