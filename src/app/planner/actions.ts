'use server'
import { generateInitialBlueprint } from '@/ai/flows/generate-initial-blueprint'
import { optimizeCityPlanCost } from '@/ai/flows/optimize-city-plan-cost'
import { assessEnvironmentalImpact, type AssessEnvironmentalImpactInput } from '@/ai/flows/assess-environmental-impact'

export async function getInitialPlan(cityDescription: string) {
  const prompt = `
    You are an AI city planning assistant. Your task is to generate a multi-part city plan based on a user's description.

    **City Description**:
    ${cityDescription}

    ---

    **Instructions**:
    You must generate a response with three distinct sections, formatted exactly as shown below using Markdown headings.

    **1. Raw Materials Section:**
    - Start with the heading: \`## Raw Materials\`
    - Analyze the city description to identify key infrastructure (e.g., buildings, roads, parks).
    - Create a bulleted list of all necessary raw materials.
    - For each material, provide an estimated quantity (e.g., tons, cubic meters).
    - Example: \`- Steel: 10,000 tons\`

    **2. Cost Estimate Section:**
    - Start with the heading: \`## Cost Estimate\`
    - Create a Markdown table with the columns: | Material | Quantity | Unit Cost (INR) | Total Cost (INR) |
    - Use the materials from the previous section.
    - Assign a realistic, market-based unit cost in Indian Rupees (₹) for each material.
    - Calculate the total cost for each material.
    - After the table, provide a summary with:
        - **Subtotal**: Sum of all total costs.
        - **Contingency (10%)**: 10% of the Subtotal.
        - **Grand Total**: Subtotal + Contingency.

    **3. Initial Blueprint Section:**
    - Start with the heading: \`## Initial Blueprint\`
    - Create a simple, top-down ASCII art diagram representing the city layout described by the user.

    **IMPORTANT**: Ensure your output strictly follows this three-section Markdown structure. Do not add any extra text or conversation before or after the structured output.
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
