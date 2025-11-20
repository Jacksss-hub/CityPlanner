'use server'
import { generateInitialBlueprint } from '@/ai/flows/generate-initial-blueprint'
import { optimizeCityPlanCost } from '@/ai/flows/optimize-city-plan-cost'
import { assessEnvironmentalImpact, type AssessEnvironmentalImpactInput } from '@/ai/flows/assess-environmental-impact'

export async function getInitialPlan(cityDescription: string) {
  const prompt = `
    Analyze the following city plan description to produce a raw material list, a cost estimate, and an ASCII art blueprint.

    **Function 1: Raw Material Supply**
    - Identify infrastructure (buildings, roads, parks).
    - List all raw materials with estimated quantities.
    - Categorize materials as 'Essential' or 'Optional/Luxury'.
    - State each material's purpose.

    **Function 2: Initial Financial Analysis**
    - Assign realistic per-unit costs in Indian Rupees (₹).
    - Create a costing table (Material, Quantity, Unit Cost, Total Cost).
    - Calculate Subtotal, a 10% contingency fee, and Grand Total.
    - State if the budget exceeds ₹10,00,000.

    **Output Format**:
    Use this exact Markdown structure:
    ## Raw Materials
    [Material list]
    ## Cost Estimate
    [Cost table and summary]
    ## Initial Blueprint
    [ASCII art blueprint]

    **City Description**:
    ${cityDescription}
  `;
  try {
    const result = await generateInitialBlueprint({ cityDescription: prompt });
    return result.blueprint;
  } catch (error) {
    console.error("Error in getInitialPlan:", error);
    throw new Error("Failed to generate the initial plan from AI.");
  }
}

export async function getOptimizedPlan(originalPlanCosting: string) {
  try {
    const result = await optimizeCityPlanCost({
      originalPlanCosting,
      budgetLimit: 1000000
    });
    return result;
  } catch (error) {
    console.error("Error in getOptimizedPlan:", error);
    throw new Error("Failed to generate the optimized cost plan.");
  }
}

export async function getEnvironmentalReport(data: AssessEnvironmentalImpactInput) {
  try {
    const result = await assessEnvironmentalImpact(data);
    return result;
  } catch (error) {
    console.error("Error in getEnvironmentalReport:", error);
    throw new Error("Failed to generate the environmental report.");
  }
}

export async function getFinalBlueprint(originalDescription: string, optimizationExplanation: string) {
  const prompt = `
    As a Builder Bot, your task is to create the final city layout blueprint and provide a comparison summary.

    The original city plan was described as:
    ---
    ${originalDescription}
    ---

    However, it was over budget and has been optimized. The following changes were made:
    ---
    ${optimizationExplanation}
    ---

    Based on these changes, perform the following tasks:

    1.  **Generate Final Blueprint**: Create a new, final ASCII art blueprint that reflects the optimizations.
    2.  **Provide Comparison**: Write a short summary comparing the original plan to the optimized plan, explaining the differences (e.g., fewer commercial blocks, smaller stadium, use of different materials).

    **Output Format**:
    Your entire output must be a single Markdown string. Use the following structure with headings:

    ## Final Blueprint

    [Your new ASCII art blueprint here]

    ## Plan Comparison

    [Your comparison summary here]
    `;
  try {
    const result = await generateInitialBlueprint({ cityDescription: prompt });
    return result.blueprint;
  } catch (error)    {
    console.error("Error in getFinalBlueprint:", error);
    throw new Error("Failed to generate the final blueprint.");
  }
}
