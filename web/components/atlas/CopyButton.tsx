
"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({
  text,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-slate-100"
    >
      {copied ? "✓ Copied" : "📋 Copy"}
    </button>
  );
}