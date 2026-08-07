import { ReactNode } from "react";

import PageContainer from "@/components/ui/PageContainer";

interface IntelligencePageProps {
  header: ReactNode;
  stats?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
}

export default function IntelligencePage({
  header,
  stats,
  sidebar,
  children,
}: IntelligencePageProps) {
  return (
    <PageContainer>

      <div className="space-y-8">

        {header}

        {stats}

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="space-y-8 lg:col-span-2">
            {children}
          </div>

          {sidebar && (
            <aside className="space-y-8">
              {sidebar}
            </aside>
          )}

        </div>

      </div>

    </PageContainer>
  );
}