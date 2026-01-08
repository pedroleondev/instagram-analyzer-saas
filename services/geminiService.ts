
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// Lista estrita de nichos solicitados
const ALLOWED_NICHES = [
  "MARKETING", "SAÚDE", "VENDAS", "MODA", "TI", "IA", "FUTEBOL", 
  "EMPREENDER", "FINANÇAS", "GASTRONOMIA", "FITNESS", "VIAGEM", 
  "BELEZA", "MATERNIDADE", "EDUCAÇÃO", "DIREITO", "PETS", 
  "GAMES", "ARQUITETURA", "RELIGIÃO"
];

// Mapeamento de palavras-chave para fallback local (caso a IA falhe ou retorne Geral)
const KEYWORD_MAP: { [key: string]: string[] } = {
  "MARKETING": ["MARKETING", "TRAFEGO", "TRÁFEGO", "COPYWRITER", "LAUNCH", "LANÇAMENTO", "SOCIAL MEDIA", "STRATEGIST"],
  "SAÚDE": ["SAUDE", "SAÚDE", "MEDICO", "MÉDICO", "NUTRI", "ENFERMEIR", "PSICOLOG", "TERAPIA", "HOSPITAL", "CLINICA"],
  "VENDAS": ["VENDAS", "VENDEDOR", "COMERCIAL", "LOJA", "ATACADO", "VAREJO", "REPRESENTANTE"],
  "MODA": ["MODA", "ESTILO", "LOOK", "ROUPA", "VESTUARIO", "FASHION", "MODELO", "ACESSORIOS"],
  "TI": ["TI", "SOFTWARE", "DESENVOLVEDOR", "PROGRAMADOR", "SISTEMAS", "TECH", "DEV", "CODIGO", "WEB"],
  "IA": ["IA", "INTELIGENCIA ARTIFICIAL", "AI", "GPT", "AUTOMACAO", "AUTOMAÇÃO", "CHATBOT"],
  "FUTEBOL": ["FUTEBOL", "JOGADOR", "TIME", "SOCCER", "BOLA", "CAMPO", "ESPORTE"],
  "EMPREENDER": ["EMPREENDER", "EMPREENDEDOR", "BUSINESS", "NEGOCIOS", "NEGÓCIOS", "CEO", "FOUNDER", "FUNDADOR", "STARTUP"],
  "FINANÇAS": ["FINANÇAS", "FINANCAS", "INVESTIMENTO", "DINHEIRO", "BOLSA", "MERCADO", "ECONOMIA", "TRADER", "BITCOIN", "CRYPTO"],
  "GASTRONOMIA": ["GASTRONOMIA", "CHEF", "COZINHA", "RESTAURANTE", "CULINARIA", "RECEITA", "FOOD", "COMIDA"],
  "FITNESS": ["FITNESS", "TREINO", "PERSONAL", "GYM", "ACADEMIA", "MUSCULAÇÃO", "CROSSFIT", "WORKOUT"],
  "VIAGEM": ["VIAGEM", "TRAVEL", "TURISMO", "VIAJAR", "ROTEIRO", "DESTINO", "TRIP"],
  "BELEZA": ["BELEZA", "MAQUIAGEM", "MAKEUP", "ESTETICA", "ESTÉTICA", "UNHAS", "CILIOS", "SOBRANCELHA", "BEAUTY"],
  "MATERNIDADE": ["MATERNIDADE", "MAE", "MÃE", "MAMAE", "MAMÃE", "BEBE", "BEBÊ", "GESTANTE", "FILHOS"],
  "EDUCAÇÃO": ["EDUCAÇÃO", "EDUCACAO", "PROFESSOR", "ENSINO", "AULA", "ESCOLA", "CURSO", "PEDAGOG", "ESTUDO"],
  "DIREITO": ["DIREITO", "ADVOGADO", "ADVOGADA", "OAB", "JURIDICO", "LEI", "ADVOCACIA"],
  "PETS": ["PETS", "PET", "CACHORRO", "GATO", "VETERINARI", "DOG", "CAT", "ANIMAIS"],
  "GAMES": ["GAMES", "GAMER", "JOGO", "STREAMER", "TWITCH", "PLAYSTATION", "XBOX", "NINTENDO", "E-SPORTS"],
  "ARQUITETURA": ["ARQUITETURA", "ARQUITETO", "DECORACAO", "DECORAÇÃO", "DESIGN DE INTERIORES", "PROJETO", "OBRA"],
  "RELIGIÃO": ["RELIGIÃO", "RELIGIAO", "DEUS", "JESUS", "IGREJA", "PASTOR", "BISPO", "BIBLIA", "FÉ", "CRISTAO", "GOSPEL"]
};

// Função de fallback que varre a bio por palavras-chave
const detectNicheByKeywords = (text: string): string => {
  if (!text) return "Geral";
  const upperText = text.toUpperCase();

  for (const niche of ALLOWED_NICHES) {
    const keywords = KEYWORD_MAP[niche] || [niche];
    // Verifica se alguma palavra-chave do nicho está presente no texto
    if (keywords.some(keyword => upperText.includes(keyword))) {
      return niche;
    }
  }
  return "Geral";
};

export const analyzeProfileNiche = async (fullName: string, bio: string, username: string = "", url: string = ""): Promise<string> => {
  const textToAnalyze = `${fullName} ${bio} ${username} ${url}`;
  
  // 1. Tenta detecção rápida por palavras-chave primeiro (mais rápido e barato)
  const keywordDetection = detectNicheByKeywords(textToAnalyze);
  if (keywordDetection !== "Geral") {
    return keywordDetection;
  }

  // 2. Se não achou por palavra-chave, usa IA
  if (!import.meta.env.VITE_GEMINI_API_KEY) return "Geral";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Modelo rápido e estável
      contents: `Classifique o perfil abaixo em UM destes nichos: ${ALLOWED_NICHES.join(", ")}.
      
      Perfil:
      - Nome: ${fullName}
      - User: ${username}
      - Bio: ${bio}
      
      Regra: Se não for óbvio, retorne "Geral". Apenas a palavra do nicho.`,
      config: {
        maxOutputTokens: 20,
        temperature: 0.0,
      },
    });

    const result = response.text?.trim().toUpperCase() || "Geral";
    return ALLOWED_NICHES.includes(result) ? result : "Geral";
  } catch (error) {
    console.error("Gemini failed, using fallback:", error);
    return "Geral";
  }
};

export const batchAnalyzeNiches = async (profiles: { fullName: string; bio: string; username: string; url: string }[]) => {
  const results: string[] = [];
  const profilesToAnalyzeWithAI: { index: number, data: any }[] = [];

  // Passo 1: Análise local por palavras-chave (instantâneo)
  profiles.forEach((profile, index) => {
    const textCombo = `${profile.fullName} ${profile.bio} ${profile.username} ${profile.url}`;
    const detected = detectNicheByKeywords(textCombo);
    
    if (detected !== "Geral") {
      results[index] = detected;
    } else {
      results[index] = "PENDING"; // Marca para IA
      profilesToAnalyzeWithAI.push({ index, data: profile });
    }
  });

  // Se todos foram resolvidos localmente, retorna
  if (profilesToAnalyzeWithAI.length === 0) {
    return results;
  }

  // Passo 2: Análise via IA apenas para os "Geral/Pendentes"
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return results.map(r => r === "PENDING" ? "Geral" : r);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Classifique os perfis abaixo estritamente em um destes nichos: [${ALLOWED_NICHES.join(", ")}].
      Retorne um array JSON de strings. Use "Geral" se incerto.
      
      Input: ${JSON.stringify(profilesToAnalyzeWithAI.map(p => ({
        id: p.index,
        nome: p.data.fullName,
        bio: p.data.bio,
        user: p.data.username
      })))}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const aiResults = JSON.parse(response.text || "[]");

    // Mesclar resultados da IA
    if (Array.isArray(aiResults)) {
      aiResults.forEach((niche: string, i: number) => {
        const originalIndex = profilesToAnalyzeWithAI[i]?.index;
        if (originalIndex !== undefined) {
          const upperNiche = niche.toUpperCase();
          results[originalIndex] = ALLOWED_NICHES.includes(upperNiche) ? upperNiche : "Geral";
        }
      });
    }
  } catch (error) {
    console.error("Batch Gemini failed:", error);
  }

  // Preencher qualquer pendência restante com Geral
  return results.map(r => r === "PENDING" ? "Geral" : r);
};
