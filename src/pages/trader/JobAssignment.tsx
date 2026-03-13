import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Users, CheckCircle2, UserPlus, X, Mail,
  MapPin, Clock, AlertCircle, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Avatar from "boring-avatars";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter,
} from "@/components/ui/drawer";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending";
  verified: boolean;
  specialties: string[];
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

const mockTeams: Team[] = [
  {
    id: "t1",
    name: "Plumbing Squad",
    members: [
      { id: "m1", name: "Alex Turner", email: "alex@example.com", status: "active", verified: true, specialties: ["plumbing", "hvac"] },
      { id: "m2", name: "James Cooper", email: "james@example.com", status: "active", verified: true, specialties: ["plumbing"] },
      { id: "m3", name: "", email: "new@example.com", status: "pending", verified: false, specialties: [] },
    ],
  },
  {
    id: "t2",
    name: "Electrical Team",
    members: [
      { id: "m4", name: "Sophie Baker", email: "sophie@example.com", status: "active", verified: true, specialties: ["electrical", "hvac"] },
      { id: "m5", name: "Liam Wright", email: "liam@example.com", status: "active", verified: false, specialties: ["electrical"] },
    ],
  },
  {
    id: "t3",
    name: "Multi-Trade Crew",
    members: [
      { id: "m6", name: "David Chen", email: "david@example.com", status: "active", verified: true, specialties: ["painting", "carpentry"] },
      { id: "m7", name: "Rachel Green", email: "rachel@example.com", status: "active", verified: true, specialties: ["cleaning", "painting"] },
    ],
  },
];

const mockJob = {
  id: "j4",
  title: "Drain Unblocking",
  icon: "🚿",
  customer: "David K.",
  location: "Oud-West",
  timeWindow: "Today, 10:00 – 12:00",
  price: 75,
};

const JobAssignment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || mockJob.id;

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualMembers, setManualMembers] = useState<TeamMember[]>([]);
  const [step, setStep] = useState<"team" | "members" | "confirm">("team");

  const selectedTeam = mockTeams.find((t) => t.id === selectedTeamId);
  const allMembers = [...(selectedTeam?.members || []), ...manualMembers];
  const verifiedSelected = allMembers.filter((m) => selectedMembers.includes(m.id) && m.verified);
  const unverifiedSelected = allMembers.filter((m) => selectedMembers.includes(m.id) && !m.verified);

  const selectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    const team = mockTeams.find((t) => t.id === teamId);
    // Pre-select all active verified members
    const activeVerified = team?.members.filter((m) => m.status === "active" && m.verified).map((m) => m.id) || [];
    setSelectedMembers(activeVerified);
    setStep("members");
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const addManualMember = () => {
    if (!manualEmail.trim()) return;
    const member: TeamMember = {
      id: `manual-${Date.now()}`,
      name: manualName.trim() || "",
      email: manualEmail.trim(),
      status: "active",
      verified: false,
      specialties: [],
    };
    setManualMembers((prev) => [...prev, member]);
    setSelectedMembers((prev) => [...prev, member.id]);
    setManualName("");
    setManualEmail("");
    setShowAddMember(false);
    toast.success("Member added");
  };

  const confirmAssignment = () => {
    if (selectedMembers.length === 0) {
      toast.error("Select at least one member");
      return;
    }
    toast.success(`Team assigned with ${selectedMembers.length} member${selectedMembers.length !== 1 ? "s" : ""}! ✅`);
    navigate("/trader/jobs");
  };

  return (
    <MobileLayout role="trader">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-2 pt-6">
        <button
          onClick={() => step === "team" ? navigate(-1) : setStep(step === "confirm" ? "members" : "team")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground font-heading">Assign Team</h1>
          <p className="text-xs text-muted-foreground">
            {step === "team" ? "Select a team" : step === "members" ? "Verify & select members" : "Review assignment"}
          </p>
        </div>
      </div>

      {/* Job preview card */}
      <div className="mx-4 mb-4 rounded-2xl bg-card p-4 card-shadow">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-xl">
            {mockJob.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground truncate">{mockJob.title}</h3>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{mockJob.location}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-0.5"><Clock className="h-3 w-3" />{mockJob.timeWindow}</span>
            </div>
          </div>
          <span className="text-lg font-extrabold text-primary">£{mockJob.price}</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mx-4 mb-4 flex items-center gap-2">
        {["team", "members", "confirm"].map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              step === s ? "bg-primary text-primary-foreground" :
              ["team", "members", "confirm"].indexOf(step) > i ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
            }`}>
              {["team", "members", "confirm"].indexOf(step) > i ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            {i < 2 && <div className={`h-0.5 flex-1 rounded-full ${["team", "members", "confirm"].indexOf(step) > i ? "bg-primary/30" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="px-4 pb-6">
        {/* Step 1: Select Team */}
        {step === "team" && (
          <div className="flex flex-col gap-2.5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Teams</p>
            {mockTeams.map((team) => {
              const activeCount = team.members.filter((m) => m.status === "active").length;
              const verifiedCount = team.members.filter((m) => m.verified).length;
              return (
                <button
                  key={team.id}
                  onClick={() => selectTeam(team.id)}
                  className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow text-left transition-all active:scale-[0.98]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{team.name}</h3>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{activeCount} active</span>
                      <span>·</span>
                      <span>{verifiedCount} verified</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}

            {/* Manual assignment option */}
            <button
              onClick={() => {
                setSelectedTeamId(null);
                setSelectedMembers([]);
                setStep("members");
              }}
              className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/50 p-4 text-left transition-all active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">Assign Manually</h3>
                <p className="text-[11px] text-muted-foreground">Add individual members without a team</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Step 2: Verify & Select Members */}
        {step === "members" && (
          <div className="flex flex-col gap-3">
            {selectedTeam && (
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{selectedTeam.name}</span>
              </div>
            )}

            {!selectedTeam && manualMembers.length === 0 && (
              <div className="rounded-2xl bg-accent/50 p-4 text-center">
                <UserPlus className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground">Add members manually below</p>
              </div>
            )}

            {allMembers.map((member) => {
              const isSelected = selectedMembers.includes(member.id);
              return (
                <button
                  key={member.id}
                  onClick={() => toggleMember(member.id)}
                  className={`flex items-center gap-3 rounded-2xl p-3.5 text-left transition-all ${
                    isSelected ? "bg-primary/5 border-2 border-primary" : "bg-card border-2 border-transparent card-shadow"
                  }`}
                >
                  <Avatar size={40} name={member.name || member.email} variant="beam" colors={avatarPalette} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground truncate">
                        {member.name || "Pending invite"}
                      </p>
                      {member.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{member.email}</p>
                    {!member.verified && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>Not verified — can still assign</span>
                      </div>
                    )}
                  </div>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  }`}>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                  </div>
                </button>
              );
            })}

            {/* Add member button */}
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-3.5 text-xs font-semibold text-primary transition-all active:scale-[0.98]"
            >
              <UserPlus className="h-4 w-4" /> Add Member
            </button>

            <button
              onClick={() => setStep("confirm")}
              disabled={selectedMembers.length === 0}
              className="mt-2 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-50 transition-transform active:scale-95"
            >
              Review Assignment ({selectedMembers.length} selected)
            </button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-card p-4 card-shadow">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assignment Summary</p>

              {selectedTeam && (
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-accent/50 px-3 py-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">{selectedTeam.name}</span>
                </div>
              )}

              {verifiedSelected.length > 0 && (
                <div className="mb-3">
                  <p className="mb-2 text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-primary" /> Verified Members ({verifiedSelected.length})
                  </p>
                  {verifiedSelected.map((m) => (
                    <div key={m.id} className="flex items-center gap-2.5 py-1.5">
                      <Avatar size={28} name={m.name || m.email} variant="beam" colors={avatarPalette} />
                      <span className="text-xs font-semibold text-foreground">{m.name || m.email}</span>
                    </div>
                  ))}
                </div>
              )}

              {unverifiedSelected.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Unverified ({unverifiedSelected.length})
                  </p>
                  {unverifiedSelected.map((m) => (
                    <div key={m.id} className="flex items-center gap-2.5 py-1.5">
                      <Avatar size={28} name={m.name || m.email} variant="beam" colors={avatarPalette} />
                      <span className="text-xs font-semibold text-foreground">{m.name || m.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={confirmAssignment}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
            >
              Confirm & Assign Team
            </button>
          </div>
        )}
      </div>

      {/* Add member drawer */}
      <Drawer open={showAddMember} onOpenChange={setShowAddMember}>
        <DrawerContent className="mx-auto max-w-[390px]">
          <DrawerHeader>
            <DrawerTitle>Add Member</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-3 px-4 pb-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Name (optional)</label>
              <input
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="worker@email.com"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && addManualMember()}
                />
              </div>
            </div>
          </div>
          <DrawerFooter>
            <button
              onClick={addManualMember}
              disabled={!manualEmail.trim()}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              Add Member
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
};

export default JobAssignment;
