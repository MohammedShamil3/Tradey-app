import { useState } from "react";
import { Calendar, Clock, PoundSterling, MapPin, ChevronDown, FileText, Mic, Star, Users, Ban, MessageSquare } from "lucide-react";
import Avatar from "boring-avatars";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

const statusColors: Record<string, string> = {
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
  in_progress: "bg-amber-500/10 text-amber-600",
};

export interface AssignmentWorker {
  id: string;
  name: string;
  hoursWorked: number;
  earned: number;
}

export interface AssignmentData {
  id: string;
  title: string;
  date: string;
  status: "completed" | "cancelled" | "in_progress";
  amount: number;
  hours: number;
  address: string;
  worker?: string;
  workerId?: string;
  workers?: AssignmentWorker[];
  customerNotes?: string;
  customerVoiceNote?: boolean;
  customerName?: string;
}

// Mock enriched details keyed by assignment id
const mockDetails: Record<string, {
  notes: string;
  voiceNote: boolean;
  customerName: string;
  rating: number | null;
  workers: AssignmentWorker[];
  completedDate?: string;
  category: string;
  cancellationNotes?: string;
  review?: {
    ratings: { label: string; score: number }[];
    comment: string;
  };
}> = {
  a1: { notes: "The kitchen tap has been dripping for about a week now. It's the hot water side. Please bring replacement washers just in case.", voiceNote: true, customerName: "Sarah Mitchell", rating: 5, workers: [{ id: "m1", name: "Alex Turner", hoursWorked: 1, earned: 30 }, { id: "m2", name: "James Cooper", hoursWorked: 0.5, earned: 15 }], completedDate: "5 Mar 2026", category: "Plumbing", review: { ratings: [{ label: "Quality of Work", score: 5 }, { label: "Professionalism", score: 5 }, { label: "Punctuality", score: 5 }, { label: "Communication", score: 5 }, { label: "Value for Money", score: 4 }], comment: "Brilliant job — fixed the drip in no time. Very tidy, cleaned up after themselves." } },
  a2: { notes: "Shower drain is completely blocked. Tried using drain cleaner but no luck. Water pools up within a minute.", voiceNote: false, customerName: "John Davies", rating: 5, workers: [{ id: "m2", name: "James Cooper", hoursWorked: 2, earned: 60 }, { id: "m1", name: "Alex Turner", hoursWorked: 1, earned: 30 }], completedDate: "3 Mar 2026", category: "Plumbing", review: { ratings: [{ label: "Quality of Work", score: 5 }, { label: "Professionalism", score: 5 }, { label: "Punctuality", score: 4 }, { label: "Communication", score: 5 }, { label: "Value for Money", score: 5 }], comment: "Drain sorted quickly. Great communication throughout." } },
  a3: { notes: "Toilet keeps running after flushing. The float valve might need replacing. It's a standard close-coupled toilet.", voiceNote: true, customerName: "Emma Watson", rating: 4, workers: [{ id: "m1", name: "Alex Turner", hoursWorked: 1, earned: 30 }, { id: "m2", name: "James Cooper", hoursWorked: 0.5, earned: 15 }], completedDate: "28 Feb 2026", category: "Plumbing", review: { ratings: [{ label: "Quality of Work", score: 4 }, { label: "Professionalism", score: 4 }, { label: "Punctuality", score: 3 }, { label: "Communication", score: 5 }, { label: "Value for Money", score: 4 }], comment: "Good job overall, slightly late but communicated well." } },
  a4: { notes: "Annual boiler service needed. Vaillant ecoTEC plus, installed 2019. Last serviced March 2025.", voiceNote: false, customerName: "Mark Thompson", rating: null, workers: [{ id: "m2", name: "James Cooper", hoursWorked: 0, earned: 0 }], category: "HVAC", cancellationNotes: "Had a family emergency and won't be available on this date. Apologies for the short notice, happy to rebook for next week." },
  a5: { notes: "Mixer tap in the bathroom is stiff and leaking from the base. Ideally replace with a new one if repair isn't possible.", voiceNote: true, customerName: "Rachel Green", rating: 5, workers: [{ id: "m1", name: "Alex Turner", hoursWorked: 1.5, earned: 45 }, { id: "m2", name: "James Cooper", hoursWorked: 1, earned: 30 }], completedDate: "20 Feb 2026", category: "Plumbing", review: { ratings: [{ label: "Quality of Work", score: 5 }, { label: "Professionalism", score: 5 }, { label: "Punctuality", score: 5 }, { label: "Communication", score: 5 }, { label: "Value for Money", score: 5 }], comment: "Replaced the tap completely — looks and works great. Highly recommend!" } },
  a6: { notes: "Kitchen sink drain blocked. Quite slow to drain, smells a bit too. Ground floor flat.", voiceNote: false, customerName: "Mike Brown", rating: 5, workers: [{ id: "m4", name: "Sophie Baker", hoursWorked: 2, earned: 70 }, { id: "m5", name: "Liam Wright", hoursWorked: 1, earned: 35 }], completedDate: "6 Mar 2026", category: "Electrical", review: { ratings: [{ label: "Quality of Work", score: 5 }, { label: "Professionalism", score: 5 }, { label: "Punctuality", score: 5 }, { label: "Communication", score: 4 }, { label: "Value for Money", score: 5 }], comment: "Very thorough and clean work." } },
  a7: { notes: "Bathroom tap dripping constantly. Cold water side. The tap is quite old so might need full replacement.", voiceNote: true, customerName: "Lisa Kelly", rating: 4, workers: [{ id: "m4", name: "Sophie Baker", hoursWorked: 1, earned: 35 }, { id: "m5", name: "Liam Wright", hoursWorked: 0.5, earned: 17 }], completedDate: "2 Mar 2026", category: "Electrical", review: { ratings: [{ label: "Quality of Work", score: 4 }, { label: "Professionalism", score: 4 }, { label: "Punctuality", score: 4 }, { label: "Communication", score: 4 }, { label: "Value for Money", score: 4 }], comment: "Got the job done well." } },
  a8: { notes: "Toilet cistern not filling properly after flush. Sometimes need to jiggle the handle.", voiceNote: false, customerName: "David Palmer", rating: null, workers: [{ id: "m5", name: "Liam Wright", hoursWorked: 4, earned: 140 }, { id: "m4", name: "Sophie Baker", hoursWorked: 2, earned: 70 }], category: "Electrical" },
  a9: { notes: "Need 3 new double sockets installed in the living room. Currently only have 1 socket on the far wall.", voiceNote: true, customerName: "Tom Harris", rating: 5, workers: [{ id: "m4", name: "Sophie Baker", hoursWorked: 2, earned: 70 }], completedDate: "6 Mar 2026", category: "Electrical", review: { ratings: [{ label: "Quality of Work", score: 5 }, { label: "Professionalism", score: 5 }, { label: "Punctuality", score: 5 }, { label: "Communication", score: 5 }, { label: "Value for Money", score: 5 }], comment: "Fantastic electrician, very knowledgeable." } },
  a10: { notes: "Replace ceiling light fitting in the hallway. Already bought the new light, just need installation.", voiceNote: false, customerName: "Nina Patel", rating: 4, workers: [{ id: "m4", name: "Sophie Baker", hoursWorked: 1, earned: 35 }], completedDate: "2 Mar 2026", category: "Electrical", review: { ratings: [{ label: "Quality of Work", score: 4 }, { label: "Professionalism", score: 5 }, { label: "Punctuality", score: 4 }, { label: "Communication", score: 4 }, { label: "Value for Money", score: 3 }], comment: "Good installation, slightly pricey for a simple fitting." } },
  a11: { notes: "Full rewiring of a 2-bed flat. The current wiring is from the 1970s. Need new consumer unit as well.", voiceNote: true, customerName: "Anna Price", rating: null, workers: [{ id: "m5", name: "Liam Wright", hoursWorked: 8, earned: 280 }, { id: "m4", name: "Sophie Baker", hoursWorked: 4, earned: 140 }], category: "Electrical" },
};

interface Props {
  assignment: AssignmentData;
  showWorker?: boolean;
}

const AssignmentCard = ({ assignment: a, showWorker = false }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const details = mockDetails[a.id];

  return (
    <div className="rounded-2xl bg-card card-shadow overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-sm font-bold text-foreground flex-1 truncate mr-2">{a.title}</h4>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${statusColors[a.status]}`}>
            {a.status === "in_progress" ? "In Progress" : a.status.charAt(0).toUpperCase() + a.status.slice(1)}
          </span>
        </div>
        {showWorker && a.worker && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <Avatar size={16} name={a.worker} variant="beam" colors={avatarPalette} />
            <span className="text-[11px] font-semibold text-foreground">{a.worker}</span>
            {details && details.workers.length > 1 && (
              <span className="text-[10px] text-muted-foreground">+{details.workers.length - 1} more</span>
            )}
          </div>
        )}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{a.date}</span>
          {a.hours > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.hours}h</span>}
          {a.amount > 0 && <span className="flex items-center gap-1"><PoundSterling className="h-3 w-3" />£{a.amount}</span>}
          {details?.rating && (
            <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-star text-star" />{details.rating}</span>
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3" />{a.address}
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {expanded && details && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
          {/* Customer + Rating overview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar size={28} name={details.customerName} variant="beam" colors={avatarPalette} />
              <div>
                <p className="text-xs font-bold text-foreground">{details.customerName}</p>
                <p className="text-[10px] text-muted-foreground">Customer</p>
              </div>
            </div>
            {details.rating ? (
              <div className="flex items-center gap-1 rounded-lg bg-accent/60 px-2 py-1">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-2.5 w-2.5 ${i < details.rating! ? "fill-star text-star" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-foreground ml-0.5">{details.rating}/5</span>
              </div>
            ) : (
              <span className="rounded-lg bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">No rating</span>
            )}
          </div>

          {/* Customer Review Breakdown */}
          {details.review && (
            <div className="rounded-xl bg-accent/50 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer Review</span>
              </div>
              <div className="flex flex-col gap-1.5 mb-2.5">
                {details.review.ratings.map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className="flex-1 text-[11px] text-muted-foreground">{r.label}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-2.5 w-2.5 ${i < r.score ? "fill-star text-star" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <span className="w-4 text-right text-[10px] font-bold text-foreground">{r.score}</span>
                  </div>
                ))}
              </div>
              {details.review.comment && (
                <p className="text-xs text-foreground italic leading-relaxed border-t border-border pt-2">
                  "{details.review.comment}"
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">{details.category}</span>
            {details.completedDate && <span>Completed {details.completedDate}</span>}
          </div>

          {/* Cancellation Notes */}
          {a.status === "cancelled" && details.cancellationNotes && (
            <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Ban className="h-3.5 w-3.5 text-destructive" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">Cancellation Reason</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{details.cancellationNotes}</p>
            </div>
          )}

          <div className="rounded-xl bg-accent/50 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Team Members ({details.workers.length})
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {details.workers.map((w) => (
                <div key={w.id} className="flex items-center gap-2">
                  <Avatar size={22} name={w.name} variant="beam" colors={avatarPalette} />
                  <span className="flex-1 text-xs font-semibold text-foreground">{w.name}</span>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    {w.hoursWorked > 0 && <span>{w.hoursWorked}h</span>}
                    {w.earned > 0 && <span className="font-bold text-primary">£{w.earned}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Notes */}
          <div className="rounded-xl bg-accent/50 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer Notes</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">{details.notes}</p>
          </div>

          {/* Voice note */}
          {details.voiceNote && (
            <div className="rounded-xl bg-accent/50 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Mic className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Voice Note</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary transition-transform active:scale-90">
                  <svg className="h-3.5 w-3.5 text-primary-foreground ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="flex-1">
                  <div className="flex items-end gap-[2px] h-6">
                    {Array.from({ length: 32 }).map((_, i) => {
                      const h = Math.sin(i * 0.4) * 0.5 + 0.5;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-full bg-primary/40"
                          style={{ height: `${Math.max(15, h * 100)}%` }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">0:00 / 1:24</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
