import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/components/recruiter/OverviewTab";

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "skills", label: "Skills" },
  { value: "companies", label: "Companies" },
  { value: "boolean", label: "Boolean" },
  { value: "ai-copilot", label: "AI Copilot" },
];

interface SearchTabsProps {
  className?: string;
  defaultValue?: string;
}

export default function SearchTabs({
  className,
  defaultValue = "overview",
}: SearchTabsProps) {
  return (
    <Tabs className={className} defaultValue={defaultValue}>
      <TabsList className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab />
      </TabsContent>

      {tabs
        .filter((tab) => tab.value !== "overview")
        .map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-6"
          >
            <div className="rounded-xl border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              Coming soon...
            </div>
          </TabsContent>
        ))}
    </Tabs>
  );
}