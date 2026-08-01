interface AIPromptCardProps {
  prompt: string;
}

export default function AIPromptCard({
  prompt,
}: AIPromptCardProps) {
  return (
    <div className="rounded-lg border bg-blue-50 p-4">
      <p className="leading-7">
        {prompt}
      </p>
    </div>
  );
}