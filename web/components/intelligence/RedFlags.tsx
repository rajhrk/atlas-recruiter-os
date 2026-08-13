import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  items: string[];
}

export default function RedFlags({
  items,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recruiting Red Flags</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="list-disc space-y-2 pl-5">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}