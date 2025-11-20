"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EnvironmentalReportCardProps {
  title: string;
  risks: string;
  alternatives: string;
  score: number;
}

export function EnvironmentalReportCard({ title, risks, alternatives, score }: EnvironmentalReportCardProps) {
  const getScoreColor = (score: number) => {
    if (score > 75) return "bg-green-500";
    if (score > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Green Score: {score}/100</h4>
          <div className="flex items-center gap-2">
            <Progress value={score} className={cn("w-full h-3 [&>*]:transition-all [&>*]:duration-500", getScoreColor(score))} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {score > 75 ? "Excellent" : score > 50 ? "Moderate" : "Needs Improvement"}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Identified Environmental Risks</h4>
          <p className="text-muted-foreground">{risks}</p>
        </div>
        <div>
          <h4 className="font-semibold">Suggested Greener Alternatives</h4>
          <p className="text-muted-foreground">{alternatives}</p>
        </div>
      </CardContent>
    </Card>
  );
}
