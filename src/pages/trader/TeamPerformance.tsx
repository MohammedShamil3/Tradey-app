import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, TrendingUp, Clock, Star, CheckCircle2,
  ChevronRight, BarChart3, Users, Calendar,
} from "lucide-react";
import Avatar from "boring-avatars";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

interface MemberPerformance {
  id: string;
  name: string;
  email: string;
  totalJobs: number;
  totalHours: number;
  totalEarned: number;
  avgRating: number;
  completionRate: number;
  thisWeekHours: number;
  thisWeekJobs: number;
}

interface TeamStats {
  teamId: string;
  teamName: string;
  totalJobs: number;
  totalHours: number;
  totalPaid: number;
  avgRating: number;
  members: MemberPerformance[];
}

const mockTeamStats: TeamStats[] = [
  {
    teamId: "t1",
    teamName: "Plumbing Squad",
    totalJobs: 47,
    totalHours: 142,
    totalPaid: 4260,
    avgRating: 4.8,
    members: [
      { id: "m1", name: "Alex Turner", email: "alex@example.com", totalJobs: 28, totalHours: 84, totalEarned: 2520, avgRating: 4.9, completionRate: 96, thisWeekHours: 18, thisWeekJobs: 6 },
      { id: "m2", name: "James Cooper", email: "james@example.com", totalJobs: 19, totalHours: 58, totalEarned: 1740, avgRating: 4.7, completionRate: 92, thisWeekHours: 14, thisWeekJobs: 4 },
    ],
  },
  {
    teamId: "t2",
    teamName: "Electrical Team",
    totalJobs: 31,
    totalHours: 96,
    totalPaid: 3120,
    avgRating: 4.7,
    members: [
      { id: "m4", name: "Sophie Baker", email: "sophie@example.com", totalJobs: 18, totalHours: 54, totalEarned: 1890, avgRating: 4.8, completionRate: 98, thisWeekHours: 12, thisWeekJobs: 4 },
      { id: "m5", name: "Liam Wright", email: "liam@example.com", totalJobs: 13, totalHours: 42, totalEarned: 1230, avgRating: 4.5, completionRate: 88, thisWeekHours: 10, thisWeekJobs: 3 },
    ],
  },
];

const TeamPerformance = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamIdParam = searchParams.get("teamId");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(teamIdParam);
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "all">("month");

  const selectedTeam = mockTeamStats.find((t) => t.teamId === selectedTeamId);

  return (
    <MobileLayout role="trader">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-2 pt-6">
        <button
          onClick={() => selectedTeamId ? setSelectedTeamId(null) : navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground font-heading">
            {selectedTeam ? selectedTeam.teamName : "Team Performance"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {selectedTeam ? `${selectedTeam.members.length} members` : `${mockTeamStats.length} teams`}
          </p>
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Time period filter */}
        <div className="mb-4 flex gap-2 rounded-xl bg-muted p-1">
          {(["week", "month", "all"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                timePeriod === period ? "bg-card text-foreground card-shadow" : "text-muted-foreground"
              }`}
            >
              {period === "week" ? "This Week" : period === "month" ? "This Month" : "All Time"}
            </button>
          ))}
        </div>

        {/* Team overview list */}
        {!selectedTeamId && (
          <div className="flex flex-col gap-3">
            {/* Aggregate stats */}
            <div className="grid grid-cols-3 gap-2.5 mb-2">
              <div className="rounded-2xl bg-primary/10 p-3 text-center">
                <p className="text-lg font-extrabold text-primary">{mockTeamStats.reduce((s, t) => s + t.totalJobs, 0)}</p>
                <p className="text-[10px] text-muted-foreground">Total Jobs</p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-center">
                <p className="text-lg font-extrabold text-primary">{mockTeamStats.reduce((s, t) => s + t.totalHours, 0)}h</p>
                <p className="text-[10px] text-muted-foreground">Total Hours</p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-center">
                <p className="text-lg font-extrabold text-primary">£{mockTeamStats.reduce((s, t) => s + t.totalPaid, 0)}</p>
                <p className="text-[10px] text-muted-foreground">Total Paid</p>
              </div>
            </div>

            {mockTeamStats.map((team) => (
              <button
                key={team.teamId}
                onClick={() => setSelectedTeamId(team.teamId)}
                className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow text-left transition-all active:scale-[0.98]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground">{team.teamName}</h3>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{team.totalJobs} jobs</span>
                    <span>·</span>
                    <span>{team.totalHours}h worked</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-star text-star" />{team.avgRating}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-primary">£{team.totalPaid}</p>
                  <p className="text-[10px] text-muted-foreground">paid out</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Team detail — member performance */}
        {selectedTeam && (
          <div className="flex flex-col gap-3">
            {/* Team summary cards */}
            <div className="grid grid-cols-2 gap-2.5 mb-1">
              <div className="rounded-2xl bg-card p-3.5 card-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Jobs Done</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{selectedTeam.totalJobs}</p>
              </div>
              <div className="rounded-2xl bg-card p-3.5 card-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hours</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{selectedTeam.totalHours}h</p>
              </div>
              <div className="rounded-2xl bg-card p-3.5 card-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 fill-star text-star" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Rating</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{selectedTeam.avgRating}</p>
              </div>
              <div className="rounded-2xl bg-card p-3.5 card-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Paid</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">£{selectedTeam.totalPaid}</p>
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Members</p>

            {selectedTeam.members.map((member) => (
              <button
                key={member.id}
                onClick={() => navigate(`/trader/member-tasks?memberId=${member.id}&teamId=${selectedTeam.teamId}`)}
                className="rounded-2xl bg-card p-4 card-shadow text-left transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <Avatar size={42} name={member.name} variant="beam" colors={avatarPalette} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">{member.name}</h4>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-star text-star" />{member.avgRating}</span>
                      <span>·</span>
                      <span>{member.completionRate}% completion</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-accent/50 px-2 py-1.5 text-center">
                    <p className="text-xs font-extrabold text-foreground">{member.totalJobs}</p>
                    <p className="text-[9px] text-muted-foreground">Jobs</p>
                  </div>
                  <div className="rounded-xl bg-accent/50 px-2 py-1.5 text-center">
                    <p className="text-xs font-extrabold text-foreground">{member.totalHours}h</p>
                    <p className="text-[9px] text-muted-foreground">Hours</p>
                  </div>
                  <div className="rounded-xl bg-accent/50 px-2 py-1.5 text-center">
                    <p className="text-xs font-extrabold text-foreground">£{member.totalEarned}</p>
                    <p className="text-[9px] text-muted-foreground">Earned</p>
                  </div>
                </div>
              </button>
            ))}

            {/* Create paychecks button */}
            <button
              onClick={() => navigate(`/trader/paychecks?teamId=${selectedTeam.teamId}`)}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
            >
              Create Paychecks
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default TeamPerformance;
