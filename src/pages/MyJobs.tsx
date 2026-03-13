import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, Clock, MapPin, Star, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { EmojiIcon, getEmojiIconColors } from "@/lib/icons";

interface Bid {
  id: string;
  traderName: string;
  avatar: string;
  rating: number;
  reviews: number;
  price: number;
  message: string;
  estimatedDays: number;
  verified: boolean;
}

// Mock data
const mockJobs = [
  {
    id: "job-1",
    title: "Bathroom Renovation - Complete Remodel",
    description: "Need full bathroom renovation including new tiles, bathtub, sink, and toilet. Room is approximately 8m².",
    status: "receiving_bids" as const,
    urgency: "within_week",
    postedAt: "2 hours ago",
    location: "London, SW1A",
    bidsCount: 3,
    bids: [
      { id: "b1", traderName: "Mike's Plumbing", avatar: "🔧", rating: 4.9, reviews: 87, price: 4500, message: "Hi! I've done 50+ bathroom renovations in the SW1 area. Can start next week. Price includes all materials and labour.", estimatedDays: 5, verified: true },
      { id: "b2", traderName: "ProBuild Services", avatar: "🏗️", rating: 4.7, reviews: 43, price: 3800, message: "Great project! I can offer a competitive price. Materials not included but I can source them at trade prices.", estimatedDays: 7, verified: true },
      { id: "b3", traderName: "HandyDan", avatar: "🛠️", rating: 4.5, reviews: 22, price: 5200, message: "Premium finish guaranteed. I use only top-quality materials. 2-year warranty on all work.", estimatedDays: 4, verified: false },
    ] as Bid[],
  },
  {
    id: "job-2",
    title: "Kitchen Cabinet Replacement",
    description: "Replace all kitchen cabinets (12 units). Measurements already taken.",
    status: "posted" as const,
    urgency: "flexible",
    postedAt: "1 day ago",
    location: "London, E1",
    bidsCount: 0,
    bids: [] as Bid[],
  },
];

const MyJobs = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const job = selectedJob ? mockJobs.find((j) => j.id === selectedJob) : null;

  if (job) {
    return (
      <MobileLayout>
        <div className="px-4 pt-6">
          <div className="mb-5 flex items-center gap-3">
            <button
              onClick={() => setSelectedJob(null)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground font-heading">{job.title}</h1>
              <p className="text-xs text-muted-foreground">{job.postedAt} • {job.location}</p>
            </div>
          </div>

          {/* Job details */}
          <div className="mb-5 rounded-2xl bg-card p-4 card-shadow">
            <p className="text-sm text-foreground">{job.description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.urgency === "urgent" ? "ASAP" : job.urgency === "within_week" ? "This week" : "Flexible"}</span>
            </div>
          </div>

          {/* Bids */}
          <h3 className="mb-3 font-bold text-foreground">
            Quotes received ({job.bids.length})
          </h3>

          {job.bids.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl bg-card p-8 card-shadow text-center">
              <AlertCircle className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-bold text-foreground">No quotes yet</p>
              <p className="text-sm text-muted-foreground">Tradesmen are reviewing your job. You'll be notified when quotes arrive.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {job.bids.map((bid) => (
                <div key={bid.id} className="rounded-2xl bg-card p-4 card-shadow">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getEmojiIconColors(bid.avatar).bg} bg-opacity-40`}>
                        <EmojiIcon emoji={bid.avatar} size={24} weight="regular" colorize />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground">{bid.traderName}</h4>
                          {bid.verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-star text-star" />
                          {bid.rating} ({bid.reviews} reviews)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">£{bid.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{bid.estimatedDays} days</p>
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-muted-foreground">{bid.message}</p>

                  <div className="flex gap-2">
                    <button className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95">
                      Accept Quote
                    </button>
                    <button className="flex items-center justify-center rounded-xl bg-muted px-4 py-2.5 text-sm font-bold text-foreground transition-transform active:scale-95">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="px-4 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-heading">My Jobs</h1>
            <p className="text-sm text-muted-foreground">Track your posted jobs and quotes</p>
          </div>
          <button
            onClick={() => navigate("/jobs/post")}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
          >
            + Post Job
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {mockJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job.id)}
              className="rounded-2xl bg-card p-4 card-shadow text-left transition-all hover:card-shadow-hover active:scale-[0.98]"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="flex-1 font-bold text-foreground">{job.title}</h3>
                <span className={`ml-2 shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${
                  job.status === "receiving_bids"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {job.status === "receiving_bids" ? `${job.bidsCount} quotes` : "Posted"}
                </span>
              </div>
              <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{job.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.postedAt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default MyJobs;
