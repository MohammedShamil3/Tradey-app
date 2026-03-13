import { useState } from "react";
import {
  Plus,
  Trash2,
  PoundSterling,
  Package,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Send,
  X,
  BarChart3,
  UserPlus,
  ClipboardList,
  HardHat,
} from "lucide-react";
import Avatar from "boring-avatars";
import QuoteMessage, { type QuoteMessageData } from "./QuoteMessage";

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface MemberEstimate {
  memberId: string;
  memberName: string;
  memberRole: string;
  materials: QuoteLineItem[];
  materialsTotal: number;
  submitted: boolean;
}

export interface LabourLineItem {
  id: string;
  role: string;
  count: number;
}

interface GroupData {
  id: string;
  name: string;
  members: { id: string; name: string; role: string }[];
}

interface CollaborativeQuoteProps {
  groups: GroupData[];
  individuals: { id: string; name: string; role: string }[];
  onSendQuote: (data: {
    materials: QuoteLineItem[];
    labourTotal: number;
    total: number;
    labourLines: LabourLineItem[];
    message?: string;
    voiceNoteBlob?: Blob;
    voiceNoteDuration?: string;
  }) => void;
  onCancel: () => void;
}

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

type Step = "choose" | "select-members" | "confirm-assign" | "waiting" | "review";

const resolveBasePay = (role: string) => {
  const lower = role.toLowerCase();
  if (lower.includes("helper")) return 25;
  if (lower.includes("labour")) return 25;
  return 30;
};

const CollaborativeQuote = ({ groups, individuals, onSendQuote, onCancel }: CollaborativeQuoteProps) => {
  const [step, setStep] = useState<Step>("choose");

  // Selection
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
  const [selectedIndividuals, setSelectedIndividuals] = useState<{ id: string; name: string; role: string }[]>([]);
  const [individualSearch, setIndividualSearch] = useState("");

  // Estimates from workers
  const [estimates, setEstimates] = useState<MemberEstimate[]>([]);
  const [expandedEstId, setExpandedEstId] = useState<string | null>(null);

  // Final review - materials (averaged)
  const [finalMaterials, setFinalMaterials] = useState<QuoteLineItem[]>([]);

  // Final review - labour (type + quantity only, base pay used automatically)
  const [labourLines, setLabourLines] = useState<LabourLineItem[]>([{ id: crypto.randomUUID(), role: "Plumber", count: 1 }]);

  const [quoteMsg, setQuoteMsg] = useState<QuoteMessageData>({ text: "" });

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  const toggleGroupMember = (id: string) => {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getAssignedMembers = (): { id: string; name: string; role: string }[] => {
    if (selectedGroup) return selectedGroup.members.filter((m) => selectedMemberIds.has(m.id));
    return selectedIndividuals;
  };

  const buildAveragedMaterials = (workerEstimates: MemberEstimate[]) => {
    const map = new Map<
      string,
      { description: string; quantitySum: number; unitPriceSum: number; count: number }
    >();

    workerEstimates.forEach((estimate) => {
      estimate.materials.forEach((item) => {
        const key = item.description.trim().toLowerCase();
        if (!key) return;

        const existing = map.get(key);
        if (existing) {
          existing.quantitySum += item.quantity;
          existing.unitPriceSum += item.unitPrice;
          existing.count += 1;
          return;
        }

        map.set(key, {
          description: item.description,
          quantitySum: item.quantity,
          unitPriceSum: item.unitPrice,
          count: 1,
        });
      });
    });

    return Array.from(map.values()).map((entry) => ({
      id: crypto.randomUUID(),
      description: entry.description,
      quantity: Math.max(1, Math.round(entry.quantitySum / entry.count)),
      unitPrice: Math.round((entry.unitPriceSum / entry.count) * 100) / 100,
    }));
  };

  const proceedToWaiting = () => {
    const members = getAssignedMembers();
    if (members.length === 0) return;

    // Mock: each assigned member sends an estimate for items/tools
    const mockEstimates: MemberEstimate[] = members.map((m, idx) => {
      const mats: QuoteLineItem[] = [
        {
          id: crypto.randomUUID(),
          description: idx % 2 === 0 ? "Copper pipes (2m)" : "PVC pipes (3m)",
          quantity: idx % 2 === 0 ? 4 : 6,
          unitPrice: idx % 2 === 0 ? 12.5 : 8,
        },
        {
          id: crypto.randomUUID(),
          description: "Fittings & connectors",
          quantity: idx % 2 === 0 ? 8 : 10,
          unitPrice: idx % 2 === 0 ? 3.5 : 2.75,
        },
        {
          id: crypto.randomUUID(),
          description: "Sealant tape",
          quantity: idx % 2 === 0 ? 2 : 3,
          unitPrice: idx % 2 === 0 ? 4.5 : 5,
        },
      ];

      return {
        memberId: m.id,
        memberName: m.name,
        memberRole: m.role,
        materials: mats,
        materialsTotal: mats.reduce((sum, x) => sum + x.quantity * x.unitPrice, 0),
        submitted: true,
      };
    });

    setEstimates(mockEstimates);
    setFinalMaterials(buildAveragedMaterials(mockEstimates));

    // Pre-seed labour with required types/count based on assigned team
    const roleCounts = members.reduce<Record<string, number>>((acc, member) => {
      acc[member.role] = (acc[member.role] ?? 0) + 1;
      return acc;
    }, {});

    setLabourLines(
      Object.entries(roleCounts).map(([role, count]) => ({
        id: crypto.randomUUID(),
        role,
        count,
      }))
    );

    setStep("waiting");
    setTimeout(() => setStep("review"), 1200);
  };

  const estimatesAverage =
    estimates.length > 0
      ? estimates.reduce((sum, estimate) => sum + estimate.materialsTotal, 0) / estimates.length
      : 0;

  const labourTotal = labourLines.reduce((sum, line) => sum + line.count * resolveBasePay(line.role), 0);
  const finalMaterialsTotal = finalMaterials.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const grandTotal = finalMaterialsTotal + labourTotal;

  const addLabourLine = () => {
    setLabourLines((prev) => [...prev, { id: crypto.randomUUID(), role: "", count: 1 }]);
  };

  const removeLabourLine = (id: string) => {
    if (labourLines.length <= 1) return;
    setLabourLines((prev) => prev.filter((line) => line.id !== id));
  };

  const updateLabourLine = (id: string, field: keyof LabourLineItem, value: string | number) => {
    setLabourLines((prev) => prev.map((line) => (line.id === id ? { ...line, [field]: value } : line)));
  };

  if (step === "choose") {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Assign workers & request estimates
        </p>

        <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Assign to a Group</p>
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => {
              setSelectedGroupId(group.id);
              setSelectedMemberIds(new Set(group.members.map((m) => m.id)));
              setStep("select-members");
            }}
            className="flex items-center gap-3 rounded-2xl bg-card p-3.5 card-shadow transition-all active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-foreground">{group.name}</p>
              <p className="text-[11px] text-muted-foreground">{group.members.length} members</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}

        <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Or Assign Individuals</p>

        {selectedIndividuals.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedIndividuals.map((person) => (
              <span
                key={person.id}
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold text-primary"
              >
                {person.name}
                <button
                  onClick={() => setSelectedIndividuals((prev) => prev.filter((x) => x.id !== person.id))}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Search workers..."
          value={individualSearch}
          onChange={(e) => setIndividualSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
        />

        {(() => {
          const query = individualSearch.toLowerCase();
          const filtered = individuals.filter(
            (person) =>
              !selectedIndividuals.some((selected) => selected.id === person.id) &&
              (person.name.toLowerCase().includes(query) || person.role.toLowerCase().includes(query))
          );

          if (filtered.length === 0 && individualSearch) {
            return <p className="py-2 text-center text-xs text-muted-foreground">No workers found</p>;
          }

          return (
            <div className="max-h-[160px] overflow-y-auto rounded-xl border border-border bg-card">
              {filtered.map((person) => (
                <button
                  key={person.id}
                  onClick={() => {
                    setSelectedIndividuals((prev) => [...prev, person]);
                    setIndividualSearch("");
                  }}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-accent active:bg-accent"
                >
                  <Avatar size={28} name={person.name} variant="beam" colors={avatarPalette} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{person.name}</p>
                    <p className="text-[10px] text-muted-foreground">{person.role}</p>
                  </div>
                </button>
              ))}
            </div>
          );
        })()}

        <div className="mt-2 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground active:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedIndividuals.length > 0) {
                setSelectedGroupId(null);
                setStep("confirm-assign");
              }
            }}
            disabled={selectedIndividuals.length === 0}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-40"
          >
            Continue ({selectedIndividuals.length})
          </button>
        </div>
      </div>
    );
  }

  if (step === "select-members" && selectedGroup) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
          <Users className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-xs font-bold text-primary">{selectedGroup.name}</span>
          <span className="text-[10px] text-muted-foreground">· {selectedMemberIds.size} selected</span>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Review members in this group</p>

        {selectedGroup.members.map((member) => {
          const isSelected = selectedMemberIds.has(member.id);

          return (
            <button
              key={member.id}
              onClick={() => toggleGroupMember(member.id)}
              className={`flex items-center gap-3 rounded-2xl p-3.5 transition-all active:scale-[0.98] ${
                isSelected ? "border-2 border-primary bg-primary/5" : "border-2 border-transparent bg-card card-shadow"
              }`}
            >
              <Avatar size={36} name={member.name} variant="beam" colors={avatarPalette} />
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-foreground">{member.name}</p>
                <p className="text-[11px] text-muted-foreground">{member.role}</p>
              </div>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  isSelected ? "bg-primary" : "border-2 border-muted-foreground/30"
                }`}
              >
                {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
              </div>
            </button>
          );
        })}

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => {
              setStep("choose");
              setSelectedGroupId(null);
            }}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground active:bg-muted"
          >
            Back
          </button>
          <button
            onClick={() => selectedMemberIds.size > 0 && setStep("confirm-assign")}
            disabled={selectedMemberIds.size === 0}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95 disabled:opacity-40"
          >
            Continue ({selectedMemberIds.size})
          </button>
        </div>
      </div>
    );
  }

  if (step === "confirm-assign") {
    const members = getAssignedMembers();

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          <p className="text-sm font-bold text-foreground">Confirm Assignment</p>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Selected workers will receive a request to add their item estimates for this quote.
        </p>

        <div className="space-y-2 rounded-2xl border border-border bg-accent/50 p-4">
          {selectedGroup && (
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary">{selectedGroup.name}</span>
            </div>
          )}

          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-2.5">
              <Avatar size={28} name={member.name} variant="beam" colors={avatarPalette} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{member.name}</p>
                <p className="text-[10px] text-muted-foreground">{member.role}</p>
              </div>
              <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">Will estimate</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
          <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-primary/80">
            <UserPlus className="mt-0.5 h-3 w-3 shrink-0" />
            Agency reviews all submissions, uses average item estimates, then adds labour type and quantity before sending.
          </p>
        </div>

        <div className="mt-1 flex gap-2">
          <button
            onClick={() => setStep(selectedGroup ? "select-members" : "choose")}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground active:bg-muted"
          >
            Back
          </button>
          <button
            onClick={proceedToWaiting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-95"
          >
            <Send className="h-3.5 w-3.5" />
            Assign & Request
          </button>
        </div>
      </div>
    );
  }

  if (step === "waiting") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex -space-x-2">
          {estimates.map((estimate) => (
            <div key={estimate.memberId} className="rounded-full ring-2 ring-background">
              <Avatar size={32} name={estimate.memberName} variant="beam" colors={avatarPalette} />
            </div>
          ))}
        </div>
        <div className="mb-2 h-1 w-32 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-full animate-pulse rounded-full bg-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground">Collecting estimates...</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {estimates.length} worker{estimates.length !== 1 ? "s" : ""} are preparing their item estimates
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
        <p className="text-[11px] font-semibold text-primary">
          Average worker estimate: £{estimatesAverage.toFixed(2)} ({estimates.length} submission{estimates.length !== 1 ? "s" : ""})
        </p>
      </div>

      {/* Worker estimates */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5 text-primary" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Worker Item Estimates ({estimates.length})
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {estimates.map((estimate) => {
            const isExpanded = expandedEstId === estimate.memberId;

            return (
              <div key={estimate.memberId} className="overflow-hidden rounded-xl border border-border bg-card">
                <button
                  onClick={() => setExpandedEstId(isExpanded ? null : estimate.memberId)}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                >
                  <Avatar size={30} name={estimate.memberName} variant="beam" colors={avatarPalette} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-xs font-bold text-foreground">{estimate.memberName}</p>
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {estimate.memberRole} · {estimate.materials.length} items
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-primary">£{estimate.materialsTotal.toFixed(2)}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="space-y-1.5 border-t border-border bg-muted/30 px-3.5 py-3">
                    {estimate.materials.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-[11px]">
                        <span className="flex-1 truncate text-muted-foreground">
                          {item.description} <span className="text-foreground/50">×{item.quantity}</span>
                        </span>
                        <span className="ml-2 font-semibold text-foreground">£{(item.quantity * item.unitPrice).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-border pt-1.5 text-[11px]">
                      <span className="font-bold text-foreground">Worker Total</span>
                      <span className="font-extrabold text-primary">£{estimate.materialsTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Final materials - averaged */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5 text-primary" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Final Materials (Averaged)</p>
        </div>

        <div className="mb-3 space-y-2">
          {finalMaterials.map((item, idx) => (
            <div key={item.id} className="space-y-1.5 rounded-xl border border-border bg-card p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">#{idx + 1}</span>
                {finalMaterials.length > 1 && (
                  <button onClick={() => setFinalMaterials((prev) => prev.filter((m) => m.id !== item.id))}>
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  setFinalMaterials((prev) =>
                    prev.map((m) => (m.id === item.id ? { ...m, description: e.target.value } : m))
                  )
                }
                placeholder="Item description"
                className="w-full rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] text-muted-foreground">Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setFinalMaterials((prev) =>
                        prev.map((m) =>
                          m.id === item.id ? { ...m, quantity: Math.max(1, Number(e.target.value)) } : m
                        )
                      )
                    }
                    className="w-full rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground outline-none"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-[9px] text-muted-foreground">Unit £</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice || ""}
                    onChange={(e) =>
                      setFinalMaterials((prev) =>
                        prev.map((m) =>
                          m.id === item.id ? { ...m, unitPrice: Math.max(0, Number(e.target.value)) } : m
                        )
                      )
                    }
                    className="w-full rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground outline-none"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-[9px] text-muted-foreground">Sub</label>
                  <div className="rounded-lg border border-border bg-accent/40 px-2.5 py-1.5 text-xs font-semibold text-foreground">
                    £{(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() =>
              setFinalMaterials((prev) => [
                ...prev,
                { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 },
              ])
            }
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> Add item
          </button>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Labour requirement - type + quantity only */}
      <div>
        <div className="mb-1 flex items-center gap-1.5">
          <HardHat className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Labour Requirements</span>
        </div>
        <p className="mb-3 text-[10px] leading-relaxed text-muted-foreground">
          Add labour type and quantity only. Base pay is auto-used from your configured group rates.
        </p>

        <div className="mb-3 space-y-2.5">
          {labourLines.map((line, idx) => (
            <div key={line.id} className="space-y-2 rounded-xl border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground">Labour #{idx + 1}</span>
                {labourLines.length > 1 && (
                  <button onClick={() => removeLabourLine(line.id)}>
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="e.g. Plumber, Electrician, Helper"
                value={line.role}
                onChange={(e) => updateLabourLine(line.id, "role", e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={line.count}
                    onChange={(e) => updateLabourLine(line.id, "count", Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-xs text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground">Base Pay (auto)</label>
                  <div className="rounded-lg border border-border bg-accent/40 px-2.5 py-1.5 text-xs font-semibold text-foreground">
                    £{resolveBasePay(line.role)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-1 text-[11px]">
                <span className="text-muted-foreground">
                  {line.count} × £{resolveBasePay(line.role)}
                </span>
                <span className="font-bold text-primary">£{(line.count * resolveBasePay(line.role)).toFixed(2)}</span>
              </div>
            </div>
          ))}

          <button
            onClick={addLabourLine}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> Add labour type
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-1.5 rounded-xl bg-accent/50 p-3">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Materials ({finalMaterials.filter((m) => m.description.trim()).length} items)</span>
          <span className="font-semibold text-foreground">£{finalMaterialsTotal.toFixed(2)}</span>
        </div>

        {labourLines.map((line) => (
          <div key={line.id} className="flex justify-between text-[11px] text-muted-foreground">
            <span>{line.role || "Labour"} ({line.count} × £{resolveBasePay(line.role)})</span>
            <span className="font-semibold text-foreground">£{(line.count * resolveBasePay(line.role)).toFixed(2)}</span>
          </div>
        ))}

        <div className="flex justify-between border-t border-border pt-1.5">
          <span className="text-xs font-bold text-foreground">Total Quote</span>
          <span className="flex items-center gap-0.5 text-sm font-extrabold text-primary">
            <PoundSterling className="h-3.5 w-3.5" />
            {grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <QuoteMessage value={quoteMsg} onChange={setQuoteMsg} />

      <button
        onClick={() =>
          onSendQuote({
            materials: finalMaterials.filter((item) => item.description.trim()),
            labourTotal,
            labourLines,
            total: grandTotal,
            message: quoteMsg.text || undefined,
            voiceNoteBlob: quoteMsg.voiceNoteBlob,
            voiceNoteDuration: quoteMsg.voiceNoteDuration,
          })
        }
        disabled={grandTotal <= 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground active:scale-[0.98] disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
        Send Quote to Customer
      </button>
    </div>
  );
};

export default CollaborativeQuote;
