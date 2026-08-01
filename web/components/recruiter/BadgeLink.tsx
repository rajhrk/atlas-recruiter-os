"use client";

import Link from "next/link";

interface BadgeLinkProps {
  label: string;
  href: string;
}

export default function BadgeLink({
  label,
  href,
}: BadgeLinkProps) {
  return (
    <Link
      href={href}
      className="
        inline-flex
        items-center
        rounded-full
        border
        bg-muted
        px-3
        py-1
        text-sm
        transition
        hover:bg-blue-50
        hover:border-blue-500
        hover:text-blue-700
      "
    >
      {label}
    </Link>
  );
}