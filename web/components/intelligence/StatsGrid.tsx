import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  label: string;
  value: string | number;
}

interface Props {
  stats: Stat[];
}

export default function StatsGrid({
  stats,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>

            <div className="mt-2 text-2xl font-bold">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}