"use client";

import { useState } from "react";
import { AiActionPanel } from "@/components/ai-action-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PostGeneratorForm() {
  const [form, setForm] = useState({
    type: "PROJECT_SHOWCASE",
    topic: "My latest full-stack project",
    goal: "Show growth and attract internship opportunities",
    targetAudience: "Software engineers, recruiters, and founders",
    tone: "FRIENDLY",
    length: "medium",
    includeHashtags: true,
    includeEmojis: false,
    includeCallToAction: true
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Select label="Post type" value={form.type} onChange={(type) => setForm({ ...form, type })} options={["PROJECT_SHOWCASE","INTERNSHIP_COMPLETION","LEARNING_JOURNEY","TECHNICAL_EXPLANATION","ACHIEVEMENT","JOB_SEEKING","PORTFOLIO_LAUNCH","NETWORKING","PLACEMENT_PREPARATION","THOUGHT_LEADERSHIP"]} />
          <Field label="Topic" value={form.topic} onChange={(topic) => setForm({ ...form, topic })} />
          <Area label="Goal" value={form.goal} onChange={(goal) => setForm({ ...form, goal })} />
          <Field label="Target audience" value={form.targetAudience} onChange={(targetAudience) => setForm({ ...form, targetAudience })} />
          <Select label="Tone" value={form.tone} onChange={(tone) => setForm({ ...form, tone })} options={["PROFESSIONAL","FRIENDLY","CONFIDENT","CONCISE","STORYTELLING"]} />
          <Select label="Length" value={form.length} onChange={(length) => setForm({ ...form, length })} options={["short","medium","long"]} />
          {(["includeHashtags", "includeEmojis", "includeCallToAction"] as const).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.checked })} />{key.replace("include", "Include ")}</label>
          ))}
        </CardContent>
      </Card>
      <AiActionPanel endpoint="/api/ai/posts" payload={form} title="Generated post drafts" buttonLabel="Generate 3 drafts" />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label>{label}</Label><Input value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label>{label}</Label><Textarea value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label>{label}</Label><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border bg-background px-3 text-sm">{options.map((option) => <option key={option}>{option}</option>)}</select></div>;
}
