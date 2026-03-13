import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, TrendingUp, ArrowDownLeft, Landmark, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const trendData = {
  Week: [
    { label: "Mon", income: 120 },
    { label: "Tue", income: 65 },
    { label: "Wed", income: 190 },
    { label: "Thu", income: 85 },
    { label: "Fri", income: 245 },
    { label: "Sat", income: 140 },
    { label: "Sun", income: 0 },
  ],
  Month: [
    { label: "W1", income: 980 },
    { label: "W2", income: 1250 },
    { label: "W3", income: 1100 },
    { label: "W4", income: 1515 },
  ],
  Year: [
    { label: "Jan", income: 3200 },
    { label: "Feb", income: 2800 },
    { label: "Mar", income: 4845 },
    { label: "Apr", income: 3600 },
    { label: "May", income: 4100 },
    { label: "Jun", income: 5200 },
    { label: "Jul", income: 4800 },
    { label: "Aug", income: 5500 },
    { label: "Sep", income: 4200 },
    { label: "Oct", income: 3900 },
    { label: "Nov", income: 3500 },
    { label: "Dec", income: 2900 },
  ],
};

type Period = keyof typeof trendData;

const IncomeTrendChart = () => {
  const [period, setPeriod] = useState<Period>("Week");
  const data = trendData[period];
  const totalIncome = data.reduce((s, d) => s + d.income, 0);

  return (
    <div className="rounded-2xl bg-card p-4 card-shadow mb-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-foreground">Income Trend</h3>
        <div className="flex rounded-lg bg-muted p-0.5">
          {(["Week", "Month", "Year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                period === p ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[hsl(142,70%,45%)]" />
          <span className="text-[10px] font-semibold text-muted-foreground">Income £{totalIncome.toLocaleString()}</span>
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142,70%,45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142,70%,45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 11 }}
              formatter={(value: number) => [`£${value.toLocaleString()}`, "Income"]}
              labelStyle={{ fontWeight: 700, fontSize: 11 }}
            />
            <Area type="monotone" dataKey="income" stroke="hsl(142,70%,45%)" fill="url(#incomeGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const payoutHistory = [
  { id: "p1", title: "Tap Repair", customer: "Emily R.", date: "8 Mar", amount: 65, tag: "Completed" },
  { id: "p2", title: "Drain Unblocking", customer: "David K.", date: "7 Mar", amount: 75, tag: "Completed" },
  { id: "p3", title: "Wall Painting", customer: "Hannah P.", date: "6 Mar", amount: 120, tag: "Completed" },
  { id: "p4", title: "Light Switch", customer: "Mark T.", date: "5 Mar", amount: 55, tag: "Completed" },
  { id: "p5", title: "Boiler Service", customer: "James W.", date: "4 Mar", amount: 180, tag: "Completed" },
  { id: "p6", title: "Pipe Fitting", customer: "Laura S.", date: "3 Mar", amount: 95, tag: "Completed" },
  { id: "p7", title: "Toilet Repair", customer: "Chris D.", date: "2 Mar", amount: 45, tag: "Completed" },
  { id: "p8", title: "Shower Install", customer: "Nina K.", date: "1 Mar", amount: 210, tag: "Completed" },
];

const TraderEarnings = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const traderType = profile?.trader_type ?? "individual";
  const isIndividual = traderType === "individual";

  const totalIncome = payoutHistory.reduce((s, p) => s + p.amount, 0);

  return (
    <MobileLayout role="trader">
      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-heading">Earnings</h1>
            <p className="text-xs text-muted-foreground">Your income & payouts</p>
          </div>
        </div>

        {/* Earnings card */}
        <div className="rounded-2xl bg-primary p-5 card-shadow mb-5">
          <p className="text-xs font-semibold text-primary-foreground/70">Total Earnings (This Month)</p>
          <h2 className="mt-1 text-3xl font-extrabold text-primary-foreground">£{totalIncome.toLocaleString()}</h2>
          <div className="mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-primary-foreground/80" />
            <span className="text-xs font-semibold text-primary-foreground/80">+17% vs last month</span>
          </div>
          {/* Auto-deposit info */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-3 py-2.5">
            <Landmark className="h-4 w-4 text-primary-foreground/70" />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-primary-foreground/90">Auto-deposited to ING Bank ····4821</p>
              <p className="text-[10px] text-primary-foreground/60">Payments are credited automatically</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-primary-foreground/70" />
          </div>
        </div>

        {/* Quick stats — income only */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="rounded-2xl bg-card p-3 card-shadow text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Jobs Done</p>
            <p className="text-lg font-extrabold text-foreground">8</p>
          </div>
          <div className="rounded-2xl bg-card p-3 card-shadow text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg / Job</p>
            <p className="text-lg font-extrabold text-foreground">£{Math.round(totalIncome / 8)}</p>
          </div>
        </div>

        {/* Income Trend */}
        <IncomeTrendChart />

        {/* Recent Payouts */}
        <h3 className="mb-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Recent Payouts</h3>
        <div className="flex flex-col gap-2">
          {payoutHistory.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 rounded-2xl bg-card p-3.5 card-shadow">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(142,70%,45%)]/10">
                <ArrowDownLeft className="h-4 w-4 text-[hsl(142,70%,45%)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-foreground truncate">{tx.title}</h4>
                  <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)]">{tx.tag}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{tx.customer} · {tx.date}</p>
              </div>
              <span className="text-sm font-extrabold shrink-0 text-[hsl(142,70%,45%)]">
                +£{tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default TraderEarnings;
