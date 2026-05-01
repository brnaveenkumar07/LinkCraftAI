import { AiActionPanel } from "@/components/ai-action-panel";
import { ManualWorkflow } from "@/components/manual-workflow";
import { PageHeader } from "@/components/page-header";

export default function AnalyzerPage() {
  return (
    <>
      <PageHeader title="AI Profile Analyzer" description="Generate profile positioning, content pillars, connection personas, headline ideas, and a weekly strategy from your own profile data." />
      <ManualWorkflow />
      <div className="mt-6">
        <AiActionPanel endpoint="/api/ai/analyze-profile" title="Latest analysis" buttonLabel="Analyze profile" />
      </div>
    </>
  );
}
