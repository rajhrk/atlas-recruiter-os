"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface SearchCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

export default function SearchCard({
  icon,
  title,
  subtitle,
  onClick,
}: SearchCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
    >
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-lg font-semibold">
            {icon} {title}
          </div>

          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <ArrowRight className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}