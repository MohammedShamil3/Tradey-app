import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Bell, Calendar, MessageCircle, CheckCircle2, AlertCircle, PoundSterling, Briefcase, Zap, Star, MapPin, Building2, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import WorkerQuoteRequest, { type JobDetails } from "@/components/trader/WorkerQuoteRequest";

/* ── Customer notifications ── */
const customerNotifications = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed",
    message: "Your Tap Repair booking with John Smith on 12 Mar has been confirmed.",
    time: "2 hours ago",
    read: false,
    icon: Calendar,
  },
  {
    id: 2,
    type: "quote",
    title: "New Quote Received",
    message: "Mike's Plumbing sent you a quote of £4,500 for Bathroom Renovation.",
    time: "5 hours ago",
    read: false,
    icon: CheckCircle2,
  },
  {
    id: 3,
    type: "message",
    title: "New Message",
    message: "Sophie Baker sent you a message about your Light Installation.",
    time: "1 day ago",
    read: false,
    icon: MessageCircle,
  },
  {
    id: 4,
    type: "system",
    title: "Profile Verified",
    message: "Your profile has been verified successfully. You can now book services.",
    time: "2 days ago",
    read: true,
    icon: AlertCircle,
  },
];

/* ── Quote request data for workers ── */
interface QuoteRequestData {
  jobTitle: string;
  companyName: string;
  jobIcon: string;
  jobDetails?: JobDetails;
}

/* ── Trader notifications ── */
const traderNotifications: {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
  actionLabel?: string;
  actionRoute?: string;
  quoteRequest?: QuoteRequestData;
}[] = [
  {
    id: 10,
    type: "quote_request",
    title: "Quote Estimation Requested",
    message: "BuildRight Ltd. needs your material estimate for Office Plumbing Overhaul.",
    time: "2 min ago",
    read: false,
    icon: FileText,
    quoteRequest: {
      jobTitle: "Office Plumbing Overhaul",
      companyName: "BuildRight Ltd.",
      jobIcon: "🏢",
      jobDetails: {
        description: "We need a full plumbing overhaul for the 3rd floor office. All pipes are copper and some are corroded. There are 4 bathrooms and a kitchen that need re-piping. Please also check the water heater connections.",
        timeWindow: "Mon–Fri, 8am–5pm",
        urgency: "High Priority",
        postedAgo: "1 hour ago",
        customerName: "James Patterson",
        location: "45 King Street, Manchester",
        hasVoiceNote: true,
        voiceDuration: "1:23",
      },
    },
  },
  {
    id: 11,
    type: "quote_request",
    title: "Quote Estimation Requested",
    message: "Swift Logistics needs your material estimate for Warehouse Electrical Check.",
    time: "15 min ago",
    read: false,
    icon: FileText,
    quoteRequest: {
      jobTitle: "Warehouse Electrical Check",
      companyName: "Swift Logistics",
      jobIcon: "⚡",
      jobDetails: {
        description: "Annual electrical safety inspection for our warehouse. Need to check all distribution boards, emergency lighting, and fire alarm circuits. The warehouse is 5,000 sq ft with 3-phase power supply.",
        timeWindow: "Sat–Sun, 6am–2pm",
        urgency: null,
        postedAgo: "3 hours ago",
        customerName: "Sarah Mitchell",
        location: "Unit 12, Industrial Park, Leeds",
        hasVoiceNote: false,
      },
    },
  },
  {
    id: 1,
    type: "job",
    title: "New Job Available",
    message: "Tap Repair in Amsterdam Centrum — £65 · Emily R. needs help today.",
    time: "5 min ago",
    read: false,
    icon: Zap,
    actionLabel: "View Job",
    actionRoute: "/trader/jobs",
  },
  {
    id: 2,
    type: "job",
    title: "New Job Available",
    message: "Light Switch Replacement in De Pijp — £55 · Scheduled for tomorrow.",
    time: "12 min ago",
    read: false,
    icon: Briefcase,
    actionLabel: "View Job",
    actionRoute: "/trader/jobs",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Received",
    message: "£75 for Drain Unblocking (David K.) has been added to your balance.",
    time: "3 hours ago",
    read: false,
    icon: PoundSterling,
    actionLabel: "View Earnings",
    actionRoute: "/trader/earnings",
  },
  {
    id: 4,
    type: "review",
    title: "New Review ⭐",
    message: "Lisa M. left you a 5-star review: \"Excellent work, very professional!\"",
    time: "1 day ago",
    read: true,
    icon: Star,
  },
  {
    id: 5,
    type: "quote",
    title: "Quote Accepted",
    message: "Sarah L. accepted your £2,500 quote for Full Bathroom Renovation.",
    time: "1 day ago",
    read: true,
    icon: CheckCircle2,
    actionLabel: "View Job",
    actionRoute: "/trader/jobs",
  },
  {
    id: 6,
    type: "system",
    title: "Verification Approved",
    message: "Your ID and insurance have been verified. You'll now appear as a Verified Pro.",
    time: "2 days ago",
    read: true,
    icon: AlertCircle,
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isTrader = profile?.role === "trader";

  const allNotifs = isTrader ? traderNotifications : customerNotifications;
  const [notifications, setNotifications] = useState(allNotifs);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const [expandedQuoteId, setExpandedQuoteId] = useState<number | null>(null);

  return (
    <MobileLayout role={isTrader ? "trader" : "customer"}>
      <div className="px-4 pt-6">
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground font-heading">Notifications</h1>
            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm font-semibold text-primary">
              Mark all read
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            const isQuoteRequest = notif.type === "quote_request" && notif.quoteRequest;
            const isExpanded = expandedQuoteId === notif.id;

            return (
              <div key={notif.id} className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    markRead(notif.id);
                    if (isQuoteRequest) {
                      setExpandedQuoteId(isExpanded ? null : notif.id);
                    } else if ("actionRoute" in notif && notif.actionRoute) {
                      navigate(notif.actionRoute as string);
                    }
                  }}
                  className={`flex items-start gap-3 rounded-2xl p-4 card-shadow transition-all text-left ${
                    notif.read ? "bg-card" : "bg-primary/5 border border-primary/10"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      notif.read ? "bg-muted" : isQuoteRequest ? "bg-[hsl(25,90%,55%)]/10" : "bg-primary/10"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${notif.read ? "text-muted-foreground" : isQuoteRequest ? "text-[hsl(25,90%,55%)]" : "text-primary"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">{notif.title}</h4>
                      {!notif.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{notif.message}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground">{notif.time}</p>
                      {isQuoteRequest ? (
                        <span className="text-[10px] font-bold text-[hsl(25,90%,55%)]">
                          {isExpanded ? "Close" : "Add Estimate"} →
                        </span>
                      ) : (
                        "actionLabel" in notif && notif.actionLabel && (
                          <span className="text-[10px] font-bold text-primary">{notif.actionLabel as string} →</span>
                        )
                      )}
                    </div>
                  </div>
                </button>

                {/* Inline quote estimation form */}
                {isQuoteRequest && isExpanded && notif.quoteRequest && (
                  <WorkerQuoteRequest
                    jobTitle={notif.quoteRequest.jobTitle}
                    companyName={notif.quoteRequest.companyName}
                    jobIcon={notif.quoteRequest.jobIcon}
                    jobDetails={notif.quoteRequest.jobDetails}
                    onSubmit={(materials, total) => {
                      toast.success(`Estimate submitted: £${total.toFixed(2)}`, {
                        description: `${materials.length} item(s) sent to ${notif.quoteRequest!.companyName} for review`,
                      });
                      setExpandedQuoteId(null);
                      markRead(notif.id);
                    }}
                    onCancel={() => setExpandedQuoteId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="font-semibold text-foreground">No notifications</p>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Notifications;
