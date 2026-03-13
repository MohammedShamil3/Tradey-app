import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, CheckCircle2, Clock, MapPin, Star,
  Calendar, Plus, ChevronDown, X,
} from "lucide-react";
import Avatar from "boring-avatars";
import { toast } from "sonner";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter,
} from "@/components/ui/drawer";

const avatarPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];

interface Task {
  id: string;
  title: string;
  icon: string;
  customer: string;
  location: string;
  date: string;
  hours: number;
  basePay: number;
  status: "assigned" | "in_progress" | "completed";
}

const mockMember = {
  id: "m1",
  name: "Alex Turner",
  email: "alex@example.com",
  avgRating: 4.9,
  totalJobs: 28,
  totalHours: 84,
};

const initialTasks: Task[] = [
  { id: "t1", title: "Tap Repair", icon: "🔧", customer: "Emily R.", location: "Amsterdam Centrum", date: "Today, 14:00", hours: 2, basePay: 30, status: "in_progress" },
  { id: "t2", title: "Drain Unblocking", icon: "🚿", customer: "David K.", location: "Oud-West", date: "Today, 10:00", hours: 1.5, basePay: 30, status: "completed" },
  { id: "t3", title: "Toilet Repair", icon: "🔧", customer: "Lisa M.", location: "Oost", date: "Tomorrow, 09:00", hours: 2, basePay: 30, status: "assigned" },
  { id: "t4", title: "Wall Painting", icon: "🎨", customer: "Hannah P.", location: "Amstelveen", date: "14 Mar, 09:00", hours: 4, basePay: 25, status: "assigned" },
  { id: "t5", title: "Light Installation", icon: "💡", customer: "Tom B.", location: "De Pijp", date: "12 Mar", hours: 1.5, basePay: 28, status: "completed" },
];

const MemberTasks = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get("memberId");

  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<"all" | "assigned" | "in_progress" | "completed">("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskHours, setNewTaskHours] = useState("");
  const [newTaskBasePay, setNewTaskBasePay] = useState("30");

  const filteredTasks = tasks.filter((t) => filter === "all" ? true : t.status === filter);

  const totalHours = tasks.reduce((s, t) => s + t.hours, 0);
  const completedHours = tasks.filter((t) => t.status === "completed").reduce((s, t) => s + t.hours, 0);
  const totalEarned = tasks.filter((t) => t.status === "completed").reduce((s, t) => s + t.hours * t.basePay, 0);


  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      icon: "📋",
      customer: "Manual",
      location: "TBD",
      date: "TBD",
      hours: parseFloat(newTaskHours) || 0,
      basePay: parseFloat(newTaskBasePay) || 30,
      status: "assigned",
    };
    setTasks((prev) => [...prev, task]);
    setNewTaskTitle("");
    setNewTaskHours("");
    setShowAddTask(false);
    toast.success("Task added");
  };

  const statusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed": return "bg-primary/10 text-primary";
      case "in_progress": return "bg-amber-500/10 text-amber-600";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  const statusLabel = (status: Task["status"]) => {
    switch (status) {
      case "completed": return "Done";
      case "in_progress": return "In Progress";
      default: return "Assigned";
    }
  };

  return (
    <MobileLayout role="trader">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-2 pt-6">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground font-heading">Tasks</h1>
          <p className="text-xs text-muted-foreground">{mockMember.name}</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"
        >
          <Plus className="h-5 w-5 text-primary-foreground" />
        </button>
      </div>

      {/* Member card */}
      <div className="mx-4 mb-4 rounded-2xl bg-card p-4 card-shadow">
        <div className="flex items-center gap-3">
          <Avatar size={44} name={mockMember.name} variant="beam" colors={avatarPalette} />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground">{mockMember.name}</h3>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-star text-star" />{mockMember.avgRating}</span>
              <span>·</span>
              <span>{mockMember.totalJobs} jobs</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-accent/50 px-2 py-2 text-center">
            <p className="text-sm font-extrabold text-foreground">{totalHours}h</p>
            <p className="text-[9px] text-muted-foreground">Assigned</p>
          </div>
          <div className="rounded-xl bg-accent/50 px-2 py-2 text-center">
            <p className="text-sm font-extrabold text-foreground">{completedHours}h</p>
            <p className="text-[9px] text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-xl bg-primary/10 px-2 py-2 text-center">
            <p className="text-sm font-extrabold text-primary">£{totalEarned}</p>
            <p className="text-[9px] text-muted-foreground">Earned</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mx-4 mb-3 flex gap-1.5">
        {(["all", "assigned", "in_progress", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition-colors ${
              filter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "in_progress" ? "Active" : f.charAt(0).toUpperCase() + f.slice(1)}
            {" "}({tasks.filter((t) => f === "all" ? true : t.status === f).length})
          </button>
        ))}
      </div>

      <div className="px-4 pb-6">
        <div className="flex flex-col gap-2.5">
          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl bg-card p-8 card-shadow text-center">
              <Calendar className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-bold text-foreground">No tasks</p>
            </div>
          )}
          {filteredTasks.map((task) => (
            <div key={task.id} className="rounded-2xl bg-card card-shadow overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-lg">
                  {task.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[13px] font-bold text-foreground truncate">{task.title}</h4>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${statusColor(task.status)}`}>
                      {statusLabel(task.status)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5"><Clock className="h-3 w-3" />{task.hours}h × £{task.basePay}</span>
                    <span>·</span>
                    <span className="font-semibold text-foreground">£{task.hours * task.basePay}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{task.customer}</span>
                    <span>·</span>
                    <span>{task.date}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Add task drawer */}
      <Drawer open={showAddTask} onOpenChange={setShowAddTask}>
        <DrawerContent className="mx-auto max-w-[390px]">
          <DrawerHeader>
            <DrawerTitle>Add Task</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-3 px-4 pb-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Task Name</label>
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Tap Repair"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Hours</label>
                <input
                  type="number"
                  value={newTaskHours}
                  onChange={(e) => setNewTaskHours(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Base Pay (£/hr)</label>
                <input
                  type="number"
                  value={newTaskBasePay}
                  onChange={(e) => setNewTaskBasePay(e.target.value)}
                  placeholder="30"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
          <DrawerFooter>
            <button
              onClick={addTask}
              disabled={!newTaskTitle.trim()}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              Add Task
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </MobileLayout>
  );
};

export default MemberTasks;
