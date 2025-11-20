"use client";

import type { AssessEnvironmentalImpactOutput } from "@/ai/flows/assess-environmental-impact";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvironmentalReportCard } from "./environmental-report-card";

interface EnvironmentalReportProps {
    report: AssessEnvironmentalImpactOutput;
}

export function EnvironmentalReport({ report }: EnvironmentalReportProps) {
    const { originalPlanAnalysis, optimizedPlanAnalysis, finalRecommendation } = report;

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <EnvironmentalReportCard 
                    title="Original Plan Analysis"
                    risks={originalPlanAnalysis.environmentalRisks}
                    alternatives={originalPlanAnalysis.greenerAlternatives}
                    score={originalPlanAnalysis.greenScore}
                />
                {optimizedPlanAnalysis && (
                     <EnvironmentalReportCard 
                        title="Optimized Plan Analysis"
                        risks={optimizedPlanAnalysis.environmentalRisks}
                        alternatives={optimizedPlanAnalysis.greenerAlternatives}
                        score={optimizedPlanAnalysis.greenScore}
                    />
                )}
            </div>
             <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Final Recommendation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">{finalRecommendation}</p>
                </CardContent>
            </Card>
        </div>
    )
}
