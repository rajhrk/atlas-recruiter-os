import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  companies: string[];
}

export default function CompanyGrid({
  title,
  companies,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {companies.map((company, index) => (
            <div
              key={`${company}-${index}`}
              className="rounded-lg border bg-muted/30 p-3 transition hover:bg-muted"
            >
              {company}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}