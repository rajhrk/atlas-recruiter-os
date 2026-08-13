import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  questions: string[];
}

export default function InterviewQuestions({
  questions,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Questions</CardTitle>
      </CardHeader>

      <CardContent>
        <ol className="list-decimal space-y-3 pl-5">
          {questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}