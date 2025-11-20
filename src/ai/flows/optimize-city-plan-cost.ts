'use server';

/**
 * @fileOverview This file defines a Genkit flow to optimize the city plan cost.
 *
 * The flow takes the original cost estimate and a budget limit as input.
 * If the original cost exceeds the budget, the flow identifies expensive optional/luxury materials,
 * replaces them with affordable alternatives or reduces their quantity, and recalculates the optimized cost.
 *
 * - optimizeCityPlanCost - A function that handles the city plan cost optimization process.
 * - OptimizeCityPlanCostInput - The input type for the optimizeCityPlanCost function.
 * - OptimizeCityPlanCostOutput - The return type for the optimizeCityPlanCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCityPlanCostInputSchema = z.object({
  originalPlanCosting: z.string().describe('The original city plan costing details.'),
  budgetLimit: z.number().describe('The budget limit for the city plan (in INR).'),
});
export type OptimizeCityPlanCostInput = z.infer<typeof OptimizeCityPlanCostInputSchema>;

const OptimizeCityPlanCostOutputSchema = z.object({
  optimizedPlanCosting: z.string().describe('The optimized city plan costing details within the budget.'),
  explanation: z.string().describe('Explanation of the changes made to the original plan to fit within the budget.'),
});
export type OptimizeCityPlanCostOutput = z.infer<typeof OptimizeCityPlanCostOutputSchema>;

export async function optimizeCityPlanCost(input: OptimizeCityPlanCostInput): Promise<OptimizeCityPlanCostOutput> {
  return optimizeCityPlanCostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCityPlanCostPrompt',
  input: {schema: OptimizeCityPlanCostInputSchema},
  output: {schema: OptimizeCityPlanCostOutputSchema},
  prompt: `You are an expert city planner tasked with optimizing a city plan to fit within a budget.

Your task is to analyze the provided "Original Plan Costing" and bring the "Grand Total" under the "Budget Limit".

**Original Plan Costing**:
{{{originalPlanCosting}}}

**Budget Limit**: ₹{{{budgetLimit}}}

**Instructions**:
1.  Identify expensive optional/luxury materials.
2.  Suggest affordable alternatives or reduce quantities to lower the total cost.
3.  Recalculate the cost table with the changes.
4.  Ensure the new Grand Total is within the budget limit.
5.  Provide a clear explanation of the changes you made.

**Output Format**:
Your entire output must conform to the JSON schema.
-   \`optimizedPlanCosting\` should contain the full, recalculated cost table and summary, including Subtotal, Contingency, and the new Grand Total.
-   \`explanation\` should describe the specific optimizations you performed.
`,
});

const optimizeCityPlanCostFlow = ai.defineFlow(
  {
    name: 'optimizeCityPlanCostFlow',
    inputSchema: OptimizeCityPlanCostInputSchema,
    outputSchema: OptimizeCityPlanCostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
