import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  const provider = process.env.LLM_PROVIDER ?? (process.env.GEMINI_API_KEY ? "gemini" : "ollama");
  const isGemini = provider.toLowerCase() === "gemini";

  return (
    <>
      <PageHeader title="Settings" description="Environment and safety posture for AI-assisted drafting." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>LLM provider</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><Badge>{isGemini ? "Gemini" : "Ollama"}</Badge></p>
          {isGemini ? (
            <>
              <p>Model: {process.env.GEMINI_MODEL ?? "gemini-2.5-flash"}</p>
              <p>Configured for Vercel-compatible hosted generation.</p>
            </>
          ) : (
            <>
              <p>Base URL: {process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"}</p>
              <p>Model: {process.env.OLLAMA_MODEL ?? "mistral"}</p>
              <p>Local fallback for development when Gemini is not configured.</p>
            </>
          )}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Safety controls</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>No LinkedIn passwords are stored.</p>
          <p>No scraping, stealth browser automation, CAPTCHA bypass, or automated sending is implemented.</p>
          <p>Generated content must be reviewed, edited, approved, copied, and used manually.</p>
        </CardContent></Card>
      </div>
    </>
  );
}
