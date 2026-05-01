"use client";

import { useState, useTransition } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Props = {
  endpoint: string;
  payload?: Record<string, unknown>;
  buttonLabel: string;
  title: string;
};

export function AiActionPanel({ endpoint, payload, buttonLabel, title }: Props) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    startTransition(async () => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {})
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Generation failed.");
        return;
      }
      setResult(data);
    });
  }

  const variations = Array.isArray(result?.variations) ? (result?.variations as string[]) : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{title}</CardTitle>
        <Button onClick={run} disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {buttonLabel}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
        {variations.map((item, index) => (
          <div key={`${item}-${index}`} className="space-y-2 rounded-lg border bg-background/70 p-4">
            <div className="flex items-center justify-between">
              <Badge>Variation {index + 1}</Badge>
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(item)}>
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <Textarea value={item} onChange={() => undefined} className="min-h-36" />
          </div>
        ))}
        {result?.explanation ? <p className="text-sm text-muted-foreground">{String(result.explanation)}</p> : null}
        {result?.bestPostingTime ? <p className="text-sm text-muted-foreground">Best posting time: {String(result.bestPostingTime)}</p> : null}
      </CardContent>
    </Card>
  );
}
