"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePlanner } from "@/hooks/use-planner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, PackageSearch, CircleDollarSign, Construction, RefreshCw, Bot, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export function PlannerClient() {
  const searchParams = useSearchParams();
  const description = decodeURIComponent(searchParams.get('description') || '');

  const { state, runInitialPlanner, runOptimization, reset } = usePlanner(description);
  const [showOptimized, setShowOptimized] = useState(false);

  useEffect(() => {
    if (description) {
      runInitialPlanner();
    }
  }, [description, runInitialPlanner]);
  
  const handleOptimize = () => {
    if (state.originalCosting) {
        runOptimization();
        setShowOptimized(true);
    }
  }

  const {
    status,
    rawMaterials,
    originalCosting,
    initialBlueprint,
    optimizedCosting,
    optimizationExplanation,
    isOverBudget,
    error,
  } = state;

  const isRunning = status === 'loading';
  
  const renderPlan = (title: string, materials: string | undefined, costing: string | undefined, blueprint: string | undefined, explanation?: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-3">
          <Bot className="h-8 w-8" />
          {title}
        </CardTitle>
        {explanation && (
          <CardDescription className="flex items-start gap-3 pt-2">
            <Sparkles className="h-5 w-5 mt-1 text-primary" />
            <p className="flex-1">{explanation}</p>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-headline text-xl mb-2 flex items-center gap-2"><PackageSearch className="h-5 w-5" /> Raw Material Supplies</h3>
          <Textarea readOnly value={materials || "Generating..."} className="min-h-64 font-code text-xs bg-secondary/30" />
        </div>
        <div>
          <h3 className="font-headline text-xl mb-2 flex items-center gap-2"><CircleDollarSign className="h-5 w-5" /> Financial Requirements</h3>
          <Textarea readOnly value={costing || "Generating..."} className="min-h-64 font-code text-xs bg-secondary/30" />
        </div>
        <div>
          <h3 className="font-headline text-xl mb-2 flex items-center gap-2"><Construction className="h-5 w-5" /> City Layout Plan</h3>
          <Textarea readOnly value={blueprint || "Generating..."} className="min-h-96 font-code text-xs bg-secondary/30" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto max-w-5xl py-8 md:py-12 px-4">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Your City Plan</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Our AI crew has generated the initial blueprint for your city. Review the details below. If the cost is too high, our Finance Manager can optimize it.
        </p>
      </div>

      <div className="space-y-8">
        {status !== 'initial' && !showOptimized && renderPlan("Initial Plan", rawMaterials, originalCosting, initialBlueprint)}
        
        {showOptimized && renderPlan("Optimized Plan", rawMaterials, optimizedCosting, initialBlueprint, optimizationExplanation)}
      </div>

       {status === 'error' && (
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>
            {error?.message || "Something went wrong during plan generation."}
          </AlertDescription>
        </Alert>
      )}

      {status === 'done' && !showOptimized && (
        <div className="mt-8 flex justify-center">
            <Button onClick={handleOptimize} size="lg" className="font-bold group shadow-lg" disabled={!isOverBudget || isRunning}>
                <Sparkles className="mr-2 h-5 w-5"/>
                Make Plan Under ₹10,00,000
            </Button>
            {!isOverBudget && <p className="ml-4 text-muted-foreground self-center">Your plan is already within budget!</p>}
        </div>
      )}

      {(status === 'done' || status === 'error') && (
        <div className="mt-8 flex justify-end">
          <Button onClick={reset} disabled={isRunning} variant="outline" size="lg">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            Start a New Plan
          </Button>
        </div>
      )}
    </div>
  );
}
