import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  responsibilities: string[];
}

export default function Responsibilities({
  responsibilities,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Responsibilities</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="list-disc space-y-2 pl-5">
          {responsibilities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}