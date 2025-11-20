"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getInitialPlan, getOptimizedPlan } from "@/app/planner/actions";
import { parseInitialPlan, parseGrandTotal } from "@/lib/parsers";

type PlannerStatus =
  | 'initial'
  | 'loading'
  | 'done'
  | 'error';

interface PlannerState {
  status: PlannerStatus;
  cityDescription: string;
  rawMaterials?: string;
  originalCosting?: string;
  initialBlueprint?: string;
  grandTotal: number;
  isOverBudget: boolean;
  optimizedCosting?: string;
  optimizationExplanation?: string;
  error?: {
    step: 'initial' | 'optimization';
    message: string;
  };
}

const initialState: Omit<PlannerState, 'cityDescription'> = {
  status: 'initial',
  grandTotal: 0,
  isOverBudget: false,
};

export function usePlanner(cityDescription: string) {
  const [state, setState] = useState<PlannerState>({ ...initialState, cityDescription });
  const router = useRouter();
  const { toast } = useToast();

  const runInitialPlanner = useCallback(async () => {
    setState(s => ({ ...s, status: 'loading' }));
    toast({
        title: "Generating Initial Plan...",
        description: "Our AI crew is building your city blueprint.",
    });

    try {
      const initialPlanResponse = await getInitialPlan(cityDescription);
      const { rawMaterials, originalCosting, initialBlueprint } = parseInitialPlan(initialPlanResponse);
      const grandTotal = parseGrandTotal(originalCosting);
      
      setState(s => ({
        ...s,
        status: 'done',
        rawMaterials,
        originalCosting,
        initialBlueprint,
        grandTotal,
        isOverBudget: grandTotal > 1000000,
      }));

      toast({
        title: "Initial Plan Generated!",
        description: "Review the materials, costs, and layout.",
      });

    } catch (e) {
      const err = e as Error;
      console.error(`Error during initial plan generation:`, err);
      setState(s => ({
        ...s,
        status: 'error',
        error: { step: 'initial', message: err.message },
      }));
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: err.message || `Something went wrong during initial planning.`,
      });
    }
  }, [cityDescription, toast]);
  
  const runOptimization = useCallback(async () => {
    if (!state.originalCosting) return;

    setState(s => ({ ...s, status: 'loading' }));
    toast({
        title: "Optimizing Plan...",
        description: "Our AI Finance Manager is working on the budget.",
    });

    try {
        const optimizedPlan = await getOptimizedPlan(state.originalCosting);
        setState(s => ({
            ...s,
            status: 'done',
            optimizedCosting: optimizedPlan.optimizedPlanCosting,
            optimizationExplanation: optimizedPlan.explanation,
        }));
        toast({
            title: "Plan Optimized!",
            description: "The city plan has been updated to fit the budget.",
        });
    } catch(e) {
        const err = e as Error;
        console.error(`Error during optimization:`, err);
        setState(s => ({
          ...s,
          status: 'error',
          error: { step: 'optimization', message: err.message },
        }));
        toast({
          variant: "destructive",
          title: "Optimization Failed",
          description: err.message || `Something went wrong during budget optimization.`,
        });
    }
  }, [state.originalCosting, toast]);

  const reset = () => {
    router.push('/build');
  };

  return { state, runInitialPlanner, runOptimization, reset };
}
