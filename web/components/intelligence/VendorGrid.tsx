import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  vendors: string[];
}

export default function VendorGrid({
  vendors,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Ecosystem</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor, index) => (
            <div
              key={`${vendor}-${index}`}
              className="rounded-lg border bg-muted/30 p-3"
            >
              {vendor}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}