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
  prompt: `You are a cost optimization AI for city planning. Your task is to reduce the cost of a city plan to be under a specific budget.

**Budget Limit**: ₹{{{budgetLimit}}}

**Original Plan Costing**:
{{{originalPlanCosting}}}

---

**YOUR TASK - FOLLOW THESE STEPS EXACTLY:**

**Step 1: Identify Expensive Items**
Analyze the "Original Plan Costing" table. Find 2-3 of the most expensive materials or features that can be reduced or replaced.

**Step 2: Create an "Optimized Cost Estimate" Table**
- Create a new Markdown table named "Optimized Cost Estimate".
- This table MUST include EVERY item from the original plan.
- For the items you identified in Step 1, reduce their quantity or replace them with a cheaper alternative and calculate a new "Total Cost".
- For all other items, copy them exactly as they were.
- The table columns must be: | Material | Quantity | Unit Cost (INR) | Total Cost (INR) |

**Step 3: Calculate the New Summary**
- Below the new table, calculate the summary:
  - **Subtotal**: The sum of all "Total Cost" values in your new table.
  - **Contingency (10%)**: 10% of the new Subtotal.
  - **Grand Total**: The new Subtotal + Contingency.
- **Ensure the new Grand Total is LESS than the Budget Limit.**

**Step 4: Write the Explanation**
- Provide a brief, clear explanation of the exact changes you made to meet the budget. For example: "Reduced the amount of marble and replaced decorative statues with public gardens."

**Step 5: Format the Output**
- Combine the "Optimized Cost Estimate" table, the new summary, and the explanation into the final response fields. The \`optimizedPlanCosting\` field must contain the full table and summary. The \`explanation\` field must contain your summary of changes.
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
