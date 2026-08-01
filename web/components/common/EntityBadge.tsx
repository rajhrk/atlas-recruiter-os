"use client";

import Link from "next/link";

interface Props {
  href: string;
  label: string;
}

export default function EntityBadge({
  href,
  label,
}: Props) {
  return (
    <Link
      href={href}
      className="
      inline-flex
      rounded-full
      border
      px-3
      py-1
      text-sm
      hover:bg-slate-100
      transition-colors
      "
    >
      {label}
    </Link>
  );
}