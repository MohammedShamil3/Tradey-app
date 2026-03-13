import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate } from "react-router-dom";
import { Plus, Users, X } from "lucide-react";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  categoryCount: number;
}

const initialGroups: Group[] = [
  { id: "g1", name: "Plumbing Squad", memberCount: 2, categoryCount: 1 },
  { id: "g2", name: "Electrical Team", memberCount: 1, categoryCount: 2 },
];

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");

  const createGroup = () => {
    if (!newName.trim()) return;
    const group: Group = {
      id: `g${Date.now()}`,
      name: newName.trim(),
      memberCount: 0,
      categoryCount: 0,
    };
    setGroups((prev) => [...prev, group]);
    setNewName("");
    setShowNew(false);
    toast.success("Group created!");
    navigate(`/trader/groups/${group.id}`);
  };

  return (
    <MobileLayout role="trader">
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground font-heading">Groups</h1>
            <p className="text-sm text-muted-foreground">{groups.length} team{groups.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary transition-transform active:scale-90"
          >
            <Plus className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-6">
        {showNew && (
          <div className="rounded-2xl border-2 border-primary bg-card p-4 card-shadow">
            <p className="mb-2 text-xs font-bold text-foreground">New Group</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Plumbing Squad"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && createGroup()}
              />
              <button onClick={createGroup} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
                Create
              </button>
              <button onClick={() => setShowNew(false)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {groups.length === 0 && !showNew && (
          <div className="flex flex-col items-center rounded-2xl bg-card p-8 card-shadow text-center">
            <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-bold text-foreground">No groups yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Create a group and invite your workers</p>
            <button
              onClick={() => setShowNew(true)}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Create First Group
            </button>
          </div>
        )}

        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => navigate(`/trader/groups/${group.id}`)}
            className="flex items-center gap-3 rounded-2xl bg-card p-4 card-shadow text-left transition-all active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">{group.name}</h3>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{group.memberCount} worker{group.memberCount !== 1 ? "s" : ""}</span>
                <span>·</span>
                <span>{group.categoryCount} categories</span>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="text-xs font-bold text-primary">→</span>
            </div>
          </button>
        ))}
      </div>
    </MobileLayout>
  );
};

export default Groups;
