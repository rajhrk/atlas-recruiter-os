import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Item {
  label: string;
  value: string;
}

interface Props {
  items: Item[];
}

export default function QuickFacts({
  items,
}: Props) {
  return (
    <Card>

      <CardHeader>
        <CardTitle>Quick Facts</CardTitle>
      </CardHeader>

      <CardContent>

        <div className="space-y-5">

          {items.map((item) => (
            <div key={item.label}>

              <div className="text-sm text-muted-foreground">
                {item.label}
              </div>

              <div className="font-medium">
                {item.value}
              </div>

            </div>
          ))}

        </div>

      </CardContent>

    </Card>
  );
}