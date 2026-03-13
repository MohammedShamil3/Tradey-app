import MobileLayout from "@/components/layout/MobileLayout";
import { ArrowLeft, FileText, Shield, Scale, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const legalSections = [
  { id: "terms", icon: FileText, label: "Terms & Conditions", route: "/profile/legal/terms" },
  { id: "privacy", icon: Shield, label: "Privacy Policy", route: "/profile/legal/privacy" },
  { id: "licences", icon: Scale, label: "Licences", route: "/profile/legal/licences" },
];

const Legal = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground font-heading">Legal</h1>
      </div>
      <div className="px-4 py-5">
        <div className="rounded-2xl bg-card card-shadow overflow-hidden">
          {legalSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => navigate(section.route)}
                className={`flex w-full items-center gap-3 px-4 py-4 text-left active:bg-muted/60 transition-colors ${
                  i < legalSections.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">{section.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          Last updated: 1 March 2026
        </p>
      </div>
    </MobileLayout>
  );
};

export default Legal;
