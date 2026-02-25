import { GoogleGenAI, Type } from "@google/genai";
import { FormData, PlanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePlan(data: FormData): Promise<PlanResult> {
  const prompt = `
    Act as an expert agroforestry consultant.
    Generate a highly profitable agroforestry consortium plan based on the following parameters:
    Biome: ${data.biome}
    Region: ${data.region}
    Focus: ${data.focus}
    Area Size: ${data.areaSize}

    Return a JSON with the following structure:
    - consortium: List of plants organized by Stratum (Emergente, Alto, Médio, Baixo).
    - image_prompt: A highly detailed English prompt to generate a realistic cross-section image of this specific consortium.
    - sales_hook: A persuasive paragraph in Portuguese explaining why this combination is profitable but warning that execution is key.
    - technical_secrets: A list of 3-4 topics (e.g., "Poda de Formação", "Adubação NPK") that will be "locked/blurred".
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          consortium: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stratum: { type: Type.STRING, description: "Emergente, Alto, Médio, or Baixo" },
                plants: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["stratum", "plants"]
            }
          },
          image_prompt: { type: Type.STRING },
          sales_hook: { type: Type.STRING },
          technical_secrets: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["consortium", "image_prompt", "sales_hook", "technical_secrets"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate plan");
  }

  return JSON.parse(response.text) as PlanResult;
}
