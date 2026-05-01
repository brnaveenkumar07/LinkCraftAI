import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function MetricCard({ label, value, helper, progress }: { label: string; value: string; helper?: string; progress?: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5">
        <div className="mb-4 h-1 w-10 rounded-full bg-primary" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <div className="mt-3 text-3xl font-semibold">{value}</div>
        {helper ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p> : null}
        {typeof progress === "number" ? <Progress value={progress} className="mt-4" /> : null}
      </CardContent>
    </Card>
  );
}
