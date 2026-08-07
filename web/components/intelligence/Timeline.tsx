import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  title: string;
  items: string[];
}

export default function Timeline({
  title,
  items,
}: Props) {
  return (
    <Card>

      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>

        <div className="space-y-4">

          {items.map((item, index) => (
            <div
              key={index}
              className="border-l-4 border-primary pl-4"
            >
              {item}
            </div>
          ))}

        </div>

      </CardContent>

    </Card>
  );
}