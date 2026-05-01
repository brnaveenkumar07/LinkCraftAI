import { createConnectionTarget } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";

export default function NewConnectionPage() {
  const fields = ["name", "linkedinUrl", "currentRole", "company", "industry", "location", "whyConnect", "source", "tags"] as const;
  return (
    <>
      <PageHeader title="Add Connection Target" description="Enter manually provided profile information. No scraping, browser automation, or hidden LinkedIn actions are used." />
      <Card><CardContent className="pt-6"><form action={createConnectionTarget} className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field} className="space-y-2"><Label htmlFor={field}>{field}</Label><Input id={field} name={field} required={field === "name"} /></div>
        ))}
        <div className="space-y-2 md:col-span-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" /></div>
        <Button type="submit">Create target</Button>
      </form></CardContent></Card>
    </>
  );
}
