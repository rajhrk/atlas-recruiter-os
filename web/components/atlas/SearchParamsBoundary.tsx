"use client";

import { ReactNode, Suspense } from "react";

interface SearchParamsBoundaryProps {
  children: ReactNode;
}

export default function SearchParamsBoundary({
  children,
}: SearchParamsBoundaryProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl p-8">
          <div className="rounded-xl border bg-white p-8 text-center">
            Loading...
          </div>
        </main>
      }
    >
      {children}
    </Suspense>
  );
}