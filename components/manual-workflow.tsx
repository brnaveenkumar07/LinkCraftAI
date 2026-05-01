import { CheckCircle2, ClipboardCheck, Copy, FilePenLine, MousePointerClick, UserCheck } from "lucide-react";

const steps = [
  { label: "Generated", icon: FilePenLine },
  { label: "Reviewed", icon: ClipboardCheck },
  { label: "Edited", icon: MousePointerClick },
  { label: "Approved", icon: CheckCircle2 },
  { label: "Copied", icon: Copy },
  { label: "Manually completed", icon: UserCheck }
];

export function ManualWorkflow() {
  return (
    <div className="grid gap-2 rounded-lg border bg-card/80 p-2 shadow-soft sm:grid-cols-3 xl:grid-cols-6">
      {steps.map((step) => (
        <div key={step.label} className="flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-2 text-xs font-medium">
          <step.icon className="h-4 w-4 text-primary" />
          {step.label}
        </div>
      ))}
    </div>
  );
}
