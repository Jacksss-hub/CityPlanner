'use server';

/**
 * @fileOverview Evaluates the environmental impact of a city plan, suggests greener alternatives, and provides a Green Score.
 *
 * - assessEnvironmentalImpact - A function that handles the environmental impact assessment process.
 * - AssessEnvironmentalImpactInput - The input type for the assessEnvironmentalImpact function.
 * - AssessEnvironmentalImpactOutput - The return type for the assessEnvironmentalImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessEnvironmentalImpactInputSchema = z.object({
  cityPlanDescription: z
    .string()
    .describe('A description of the city plan, including infrastructure and features.'),
  originalCosting: z.string().optional().describe('The original cost estimate of the city plan.'),
  optimizedCosting: z
    .string()
    .optional()
    .describe('The optimized cost estimate of the city plan, if available.'),
});
export type AssessEnvironmentalImpactInput = z.infer<typeof AssessEnvironmentalImpactInputSchema>;

const AssessEnvironmentalImpactOutputSchema = z.object({
  originalPlanAnalysis: z.object({
    environmentalRisks: z.string().describe('Identified environmental risks of the original plan.'),
    greenScore: z.number().describe('A Green Score (0-100) for the original plan.'),
    greenerAlternatives: z.string().describe('Eco-friendly alternatives for the original plan.'),
  }),
  optimizedPlanAnalysis: z
    .object({
      environmentalRisks: z.string().describe('Identified environmental risks of the optimized plan.'),
      greenScore: z.number().describe('A Green Score (0-100) for the optimized plan.'),
      greenerAlternatives: z.string().describe('Eco-friendly alternatives for the optimized plan.'),
    })
    .optional(),
  finalRecommendation: z
    .string()
    .describe('Final recommendation: Original, Optimized, or Hybrid plan.'),
});
export type AssessEnvironmentalImpactOutput = z.infer<
  typeof AssessEnvironmentalImpactOutputSchema
>;

export async function assessEnvironmentalImpact(
  input: AssessEnvironmentalImpactInput
): Promise<AssessEnvironmentalImpactOutput> {
  return assessEnvironmentalImpactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessEnvironmentalImpactPrompt',
  input: {schema: AssessEnvironmentalImpactInputSchema},
  output: {schema: AssessEnvironmentalImpactOutputSchema},
  prompt: `As an environmental analyst, evaluate the city plan based on its description and costing.

**Task**:
1.  **Analyze Original Plan**:
    -   Identify environmental risks.
    -   Suggest eco-friendly alternatives.
    -   Provide a Green Score (0-100).
2.  **Analyze Optimized Plan (if provided)**:
    -   Do the same analysis as the original plan.
3.  **Final Recommendation**:
    -   Recommend the best path forward (Original, Optimized, or Hybrid).

**City Plan**: {{{cityPlanDescription}}}
**Original Cost**: {{{originalCosting}}}
**Optimized Cost**: {{{optimizedCosting}}}

Provide a structured analysis based on the inputs.
`,
});

const assessEnvironmentalImpactFlow = ai.defineFlow(
  {
    name: 'assessEnvironmentalImpactFlow',
    inputSchema: AssessEnvironmentalImpactInputSchema,
    outputSchema: AssessEnvironmentalImpactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
