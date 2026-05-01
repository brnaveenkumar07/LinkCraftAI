import { ManualWorkflow } from "@/components/manual-workflow";
import { PageHeader } from "@/components/page-header";
import { PostGeneratorForm } from "@/components/post-generator-form";

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="Generate LinkedIn Post" description="Create three draft variations with hooks, hashtags, posting-time guidance, and copy/edit controls." />
      <ManualWorkflow />
      <div className="mt-6"><PostGeneratorForm /></div>
    </>
  );
}
