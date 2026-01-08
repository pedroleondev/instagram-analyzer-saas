
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const analyzeProfileNiche = async (fullName: string, bio: string): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return "Não Categorizado";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise este perfil do Instagram e retorne UMA ÚNICA PALAVRA ou FRASE CURTA em PORTUGUÊS BRASILEIRO representando o nicho.
      
      Nome: ${fullName}
      Bio: ${bio}
      
      Exemplos de nichos em português: Fitness, Direito, Marketing Digital, E-commerce, Estilo de Vida, Finanças, Viagens, Consultoria, Coaching, Saúde, Tecnologia, Moda.
      
      IMPORTANTE: Responda APENAS com o nicho em português, sem explicações adicionais.`,
      config: {
        maxOutputTokens: 20,
        temperature: 0.1,
      },
    });

    return response.text?.trim() || "Geral";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Análise Falhou";
  }
};

export const batchAnalyzeNiches = async (profiles: { fullName: string; bio: string }[]) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return profiles.map(() => "Não Categorizado");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize os seguintes perfis do Instagram em nichos baseado em seus nomes e biografias.
      
      Input: ${JSON.stringify(profiles)}
      
      Retorne um array JSON de strings correspondendo ao nicho de cada perfil EM PORTUGUÊS BRASILEIRO.
      
      Exemplos de nichos: Fitness, Direito, Marketing Digital, E-commerce, Estilo de Vida, Finanças, Viagens, Consultoria, Coaching, Saúde, Tecnologia, Moda.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Batch Gemini analysis failed:", error);
    return profiles.map(() => "Geral");
  }
};
