import { GoogleGenAI, Type } from "@google/genai";
import { FormData, PlanResult } from "../types";

// Suporta tanto o padrão do Node (process.env) quanto do Vite (import.meta.env)
const apiKey = typeof process !== 'undefined' && process.env.GEMINI_API_KEY 
  ? process.env.GEMINI_API_KEY 
  // @ts-ignore
  : import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey });

export async function generatePlan(data: FormData): Promise<PlanResult> {
  const prompt = `
    Atue como um Engenheiro Agrônomo especialista em Agricultura Sintrópica (método Ernst Götsch).
    Você deve gerar um plano de consórcio altamente lucrativo e otimizado com base nestes parâmetros:
    
    - Bioma: ${data.biome}
    - Região: ${data.region}
    - Foco do Produtor: ${data.focus}
    - Tamanho da Área: ${data.areaSize}

    DIRETRIZES DE FOCO E SUCESSÃO:
    1. Se o Foco for "Apenas Horta": Foque em hortaliças, raízes e plantas de serviço rápido (Placenta I e II).
    2. Se o Foco for "Apenas Pomar": Foque em árvores frutíferas (Secundárias e Clímax) e árvores de biomassa (eucalipto, margaridão).
    3. Se o Foco for "Misto (Horta + Pomar)": Crie um sistema completo. Inclua a horta nas bordas/entrelinhas para gerar caixa rápido, e o pomar no centro para o longo prazo.

    Retorne APENAS um JSON válido com a seguinte estrutura:
    - consortium: Lista das plantas ideais organizadas rigorosamente por Estrato (Emergente, Alto, Médio, Baixo).
    - image_prompt: Um prompt EM INGLÊS altamente detalhado para uma IA geradora de imagens criar um diagrama/seção transversal (cross-section) realista deste canteiro.
    - sales_hook: Um parágrafo persuasivo em português explicando por que essa combinação específica é muito lucrativa para a região de ${data.region}, mas crie urgência dizendo que o segredo está no momento exato do plantio e do manejo.
    - technical_secrets: Uma lista de 3 a 4 nomes de relatórios técnicos avançados que o produtor precisaria (Ex: "Cronograma de Poda de Formação da Área", "Mapa de Plantio no Tempo", "Esquema de Adubação Verde").
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Mantive o modelo que você já estava usando
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
    throw new Error("Falha ao gerar o plano sintrópico.");
  }

  // O response.text já volta como uma string JSON perfeita graças ao responseSchema
  return JSON.parse(response.text) as PlanResult;
}
