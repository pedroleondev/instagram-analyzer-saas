import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  if (typeof window !== 'undefined' && window.env && window.env.VITE_GEMINI_API_KEY) {
    return window.env.VITE_GEMINI_API_KEY;
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

// Lista estrita de nichos solicitados
const ALLOWED_NICHES = [
  "MARKETING", "SAÚDE", "VENDAS", "MODA", "TI", "IA",
  "EMPREENDER", "FINANÇAS", "GASTRONOMIA", "FITNESS", "VIAGEM",
  "BELEZA", "MATERNIDADE", "EDUCAÇÃO", "DIREITO", "PETS",
  "GAMES", "ARQUITETURA", "RELIGIÃO"
];

// Mapeamento de palavras-chave expandido para fallback local
const KEYWORD_MAP: { [key: string]: string[] } = {
  "MARKETING": [
    "MARKETING", "TRAFEGO", "TRÁFEGO", "COPYWRITER", "LAUNCH", "LANÇAMENTO",
    "SOCIAL MEDIA", "STRATEGIST", "BRANDING", "DIGITAL", "AGENCIA", "AGÊNCIA",
    "PRODUCAO DE CONTEUDO", "GROWTH", "ADS", "GOOGLE ADS", "FACEBOOK ADS", "SEO",
    "PUBLICIDADE", "PROPAGANDA", "MARKETEIRO", "CMO", "CRO", "INBOUND", "OUTBOUND",
    "ESTRATEGISTA", "CONTEUDO DIGITAL", "INFLUENCIADOR DIGITAL", "AFILIADO", "HOTMART",
    "KIWIFY", "EDUZZ", "MONETIZZE", "PLR", "CRIADOR DE CONTEUDO", "YOUTUBER", "INFLUENCER"
  ],
  "SAÚDE": [
    "SAUDE", "SAÚDE", "MEDICO", "MÉDICO", "MEDICA", "MÉDICA", "CRM", "NUTRI",
    "NUTRICIONISTA", "CRN", "ENFERMEIR", "PSICOLOG", "CRP", "TERAPIA", "TERAPEUTA",
    "HOSPITAL", "CLINICA", "CLÍNICA", "ODONTO", "DENTISTA", "CRO", "FISIOTERAPIA",
    "CREFITO", "BIOMEDIC", "FARMAC", "SAUDAVEL", "BEM ESTAR", "PSIQUIATRA", "PEDIATRA",
    "DERMATOLOGISTA", "CIRURGIAO", "CARDIOLOGISTA", "ENDOCRINO", "GINECOLOGISTA",
    "ORTOPEDISTA", "FONOAUDIOLOG", "OFTALMO", "SAUDE MENTAL", "VIDA SAUDAVEL"
  ],
  "VENDAS": [
    "VENDAS", "VENDEDOR", "COMERCIAL", "LOJA", "ATACADO", "VAREJO", "REPRESENTANTE",
    "COMERCIO", "COMÉRCIO", "SHOP", "STORE", "DISTRIBUIDOR", "FORNECEDOR", "E-COMMERCE",
    "DROPSHIPPING", "MARKETPLACE", "CLOSER", "SDR", "BDR", "VENDER", "NEGOCIACAO",
    "ALTO TICKET", "IMOBILIARIA", "CORRETOR", "CRECI", "CONSULTOR DE VENDAS"
  ],
  "MODA": [
    "MODA", "ESTILO", "LOOK", "ROUPA", "VESTUARIO", "FASHION", "MODELO", "ACESSORIOS",
    "ACESSÓRIOS", "JOIAS", "SEMIGJOIAS", "BOLSAS", "SAPATOS", "CALÇADOS", "OUTFIT",
    "TENDENCIA", "CLOTHING", "APPAREL", "BOUTIQUE", "ATELIER", "ESTILISTA", "CONSULTORA DE IMAGEM",
    "LOOK DO DIA", "MODA FEMININA", "MODA MASCULINA", "MODA INFANTIL", "GRIFE", "LUXO", "VINTAGE", "BRECHO"
  ],
  "TI": [
    "TI", "SOFTWARE", "DESENVOLVEDOR", "PROGRAMADOR", "SISTEMAS", "TECH", "DEV",
    "CODIGO", "WEB", "FULLSTACK", "FRONTEND", "BACKEND", "JAVA", "PYTHON", "JAVASCRIPT",
    "REACT", "NODE", "CLOUD", "AWS", "AZURE", "DADOS", "DATA", "ENGENHARIA DE SOFTWARE",
    "RUBY", "PHP", "GOLANG", "FLUTTER", "SWIFT", "KOTLIN", "LINUX", "DEVOPS", "CYBERSECURITY",
    "SEGURANÇA DA INFORMAÇÃO", "SUPORTE TECNICO", "INFRAESTRUTURA", "DBA", "SQL", "NOSQL",
    "API", "GIT", "GITHUB", "DOCKER", "KUBERNETES", "CTO", "CIO"
  ],
  "IA": [
    "INTELIGENCIA ARTIFICIAL", "AI", "GPT", "AUTOMACAO", "AUTOMAÇÃO", "CHATBOT",
    "MACHINE LEARNING", "LLM", "GENERATIVE AI", "MIDJOURNEY", "STABLE DIFFUSION", "PROMPT",
    "NLP", "VISÃO COMPUTACIONAL", "DATA SCIENCE", "CIENCIA DE DADOS", "NEURAL NETWORKS",
    "DEEP LEARNING", "TENSORFLOW", "PYTORCH", "ROBOTICA", "BOT", "RPA", "ALGORITMO"
  ],
  "EMPREENDER": [
    "EMPREENDER", "EMPREENDEDOR", "BUSINESS", "NEGOCIOS", "NEGÓCIOS", "CEO", "FOUNDER",
    "FUNDADOR", "STARTUP", "EMPRESA", "GESTÃO", "LIDERANÇA", "INOVAÇÃO", "MENTOR",
    "CONSULTOR", "EXECUTIVO", "CO-FOUNDER", "DIRETOR", "PRESIDENTE", "GERENTE", "SOCIO",
    "SÓCIO", "FRANQUIA", "FRANQUEADO", "MEI", "CNPJ", "PEQUENAS EMPRESAS", "SEBRAE",
    "NETWORKING", "MINDSET", "PRODUTIVIDADE", "ALTA PERFORMANCE", "CARREIRA"
  ],
  "FINANÇAS": [
    "FINANÇAS", "FINANCAS", "INVESTIMENTO", "DINHEIRO", "BOLSA", "MERCADO", "ECONOMIA",
    "TRADER", "BITCOIN", "CRYPTO", "CRIPTOMOEDA", "CONSULTORIA FINANCEIRA", "PLANEJAMENTO",
    "RENDA", "LUCRO", "PATRIMONIO", "BANK", "BANCO", "CONTADOR", "CONTABILIDADE",
    "EDUCADOR FINANCEIRO", "YOUTUBER DE FINANÇAS", "CANAL DE FINANÇAS", "DIVIDENDOS", "FIIS",
    "AÇÕES", "TESOURO DIRETO", "CDB", "POUPANÇA", "LIBERDADE FINANCEIRA", "RICOS", "MILLIONAIRE",
    "BILIONARIO", "FORTUNA", "GANHAR DINHEIRO", "RENDA EXTRA", "FINANÇAS PESSOAIS", "ANBIMA", "CEA", "CFP"
  ],
  "GASTRONOMIA": [
    "GASTRONOMIA", "CHEF", "COZINHA", "RESTAURANTE", "CULINARIA", "RECEITA", "FOOD",
    "COMIDA", "GOURMET", "CONFEITARIA", "DOCES", "BOLOS", "PADARIA", "BAR", "DRINKS",
    "CAFE", "CAFÉ", "BUFFET", "DELIVERY", "IFOOD", "HAMBURGUERIA", "PIZZARIA", "SUSHI",
    "CHURRASCO", "CARNES", "MASTERCHEF", "COZINHEIRO", "BARTENDER", "BARISTA", "SOMMELIER",
    "DEGUSTAÇÃO", "VINHO", "CERVEJA", "ARTESANAL", "SABOR"
  ],
  "FITNESS": [
    "FITNESS", "TREINO", "PERSONAL", "GYM", "ACADEMIA", "MUSCULAÇÃO", "CROSSFIT",
    "WORKOUT", "CREF", "EDUCADOR FISICO", "COACH ESPORTIVO", "BODYBUILDER", "FISICULTURISTA",
    "EMAGRECIMENTO", "DIETA", "PERFORMANCE", "RUNNING", "CORRIDA", "YOGA", "PILATES",
    "ESPORTISTA", "SUPLEMENTOS", "WHEY", "CREATINA", "SAUDE E FORMA", "FIT", "MAROMBA",
    "HIIT", "FUNCIONAL", "CALISTENIA", "LUTA", "JIU JITSU", "MUAY THAI", "BOXE", "MMA"
  ],
  "VIAGEM": [
    "VIAGEM", "TRAVEL", "TURISMO", "VIAJAR", "ROTEIRO", "DESTINO", "TRIP", "TURISTA",
    "HOSPEDAGEM", "HOTEL", "POUSADA", "INTERCAMBIO", "MOCHILAO", "WANDERLUST", "PASSEIO",
    "AEROPORTO", "MILHAS", "PASSAGEM AEREA", "NOMADE DIGITAL", "MALA", "FERIAS", "FÉRIAS",
    "PRAIA", "MONTANHA", "CAMPO", "RESORT", "CRUZEIRO", "GUIA TURISTICO", "AGENTE DE VIAGENS"
  ],
  "BELEZA": [
    "BELEZA", "MAQUIAGEM", "MAKEUP", "ESTETICA", "ESTÉTICA", "UNHAS", "CILIOS",
    "SOBRANCELHA", "BEAUTY", "CABELEIREIR", "HAIR", "SALÃO", "SKINCARE", "PELE",
    "COSMETICOS", "PERFUME", "MICROPIGMENTAÇÃO", "LASH", "DESIGNER", "MANICURE", "PEDICURE",
    "BARBEARIA", "BARBEIRO", "BARBER", "COSMETOLOGIA", "HARMONIZAÇÃO", "BOTOX", "PREENCHIMENTO",
    "DEPILAÇÃO", "LASER", "MASSAGEM", "SPA", "AUTOESTIMA"
  ],
  "MATERNIDADE": [
    "MATERNIDADE", "MAE", "MÃE", "MAMAE", "MAMÃE", "BEBE", "BEBÊ", "GESTANTE",
    "FILHOS", "GRAVIDEZ", "PARTO", "AMAMENTAÇÃO", "PUERPERIO", "FAMILY", "FAMILIA",
    "PAIS", "CRIANÇA", "PEDIATRIA", "PAI", "PAPAI", "PATERNIDADE", "EDUCACAO PARENTAL",
    "DISCIPLINA POSITIVA", "MONTESSORI", "BRINQUEDOS", "ENXOVAL", "FESTA INFANTIL",
    "MESVERSARIO", "RECEM NASCIDO", "RN", "MAE DE PRIMEIRA VIAGEM"
  ],
  "EDUCAÇÃO": [
    "EDUCAÇÃO", "EDUCACAO", "PROFESSOR", "ENSINO", "AULA", "ESCOLA", "CURSO",
    "PEDAGOG", "ESTUDO", "VESTIBULAR", "ENEM", "CONCURSO", "APRENDIZAGEM",
    "IDIOMAS", "INGLES", "ESPANHOL", "MENTORIA", "TUTOR", "ACADEMICO", "MESTRADO",
    "DOUTORADO", "POS GRADUAÇÃO", "FACULDADE", "UNIVERSIDADE", "ALUNO", "ESTUDANTE",
    "CONCURSEIRO", "DIDATICA", "EAD", "ONLINE", "TREINAMENTO", "CAPACITAÇÃO", "PALESTRANTE"
  ],
  "DIREITO": [
    "DIREITO", "ADVOGADO", "ADVOGADA", "OAB", "JURIDICO", "LEI", "ADVOCACIA",
    "ESCRITORIO", "JUIZ", "PROMOTOR", "DEFENSOR", "TRIBUTARIO", "CRIMINAL",
    "CIVIL", "TRABALHISTA", "FAMILIA", "PREVIDENCIARIO", "EMPRESARIAL", "CONTRATOS",
    "AUDIENCIA", "PROCESSO", "JUSTIÇA", "TRIBUNAL", "FORUM", "CARTORIO", "LEGISLACAO", "DIREITO DIGITAL"
  ],
  "PETS": [
    "PETS", "PET", "CACHORRO", "GATO", "VETERINARI", "CRMV", "DOG", "CAT",
    "ANIMAIS", "BANHO E TOSA", "ADESTRADOR", "CANIL", "GATIL", "VET", "ZOO",
    "PET SHOP", "RAÇÃO", "BULLDOG", "GOLDEN", "PUG", "SHITZU", "VIRA LATA", "ADOCAO",
    "PROTEÇÃO ANIMAL", "BIOLOGO", "ZOOTECNISTA", "AQUARISMO", "PEIXES", "AVES"
  ],
  "GAMES": [
    "GAMES", "GAMER", "JOGO", "STREAMER", "TWITCH", "PLAYSTATION", "XBOX",
    "NINTENDO", "E-SPORTS", "LOL", "VALORANT", "CSGO", "FORTNITE", "MINECRAFT",
    "ROBLOX", "GAMEPLAY", "CONSOLE", "PC GAMER", "YOUTUBER DE GAMES", "CANAL DE GAMES",
    "SPEEDRUN", "RETRO", "ARCADE", "RPG", "FPS", "MOBA", "CBLOL", "PRO PLAYER", "CLÃ", "GUILDA"
  ],
  "ARQUITETURA": [
    "ARQUITETURA", "ARQUITETO", "DECORACAO", "DECORAÇÃO", "DESIGN DE INTERIORES",
    "PROJETO", "OBRA", "ENGENHEIRO", "ENGENHARIA", "CONSTRUÇÃO", "REFORMA",
    "CASA", "APARTAMENTO", "MOVEIS", "PLANEJADOS", "CAU", "CREA", "PAISAGISMO",
    "URBANISMO", "ILUMINAÇÃO", "REVESTIMENTO", "PISO", "TINTAS", "MATERIAL DE CONSTRUÇÃO",
    "IMOVEIS", "HOME DECOR", "DIY", "CASA NOVA"
  ],
  "RELIGIÃO": [
    "RELIGIÃO", "RELIGIAO", "DEUS", "JESUS", "IGREJA", "PASTOR", "BISPO",
    "BIBLIA", "FÉ", "CRISTAO", "GOSPEL", "EVANGELICO", "ESPIRITA", "CATOLICO",
    "PADRE", "MISSIONARIO", "MINISTERIO", "PREGADOR", "LOUVOR", "ESPIRITUALIDADE",
    "ORAÇÃO", "CULTO", "MISSA", "TEOLOGIA", "CRISTO", "SALVAÇÃO", "GRATIDÃO"
  ]
};

// Função de fallback que varre a bio por palavras-chave com validação de fronteira
const detectNicheByKeywords = (text: string): string => {
  if (!text) return "Geral";
  // Remove acentos e caracteres especiais para facilitar o match
  const cleanText = text.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();

  for (const niche of ALLOWED_NICHES) {
    const keywords = KEYWORD_MAP[niche];
    if (!keywords) continue;

    for (const keyword of keywords) {
      const cleanKeyword = keyword.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();

      // Para siglas curtas (2 ou 3 letras), usamos regex com word boundary (\b)
      if (cleanKeyword.length <= 3) {
        const regex = new RegExp(`\\b${cleanKeyword}\\b`, 'i');
        if (regex.test(cleanText)) {
          return niche;
        }
      } else {
        if (cleanText.includes(cleanKeyword)) {
          return niche;
        }
      }
    }
  }
  return "Geral";
};

export const analyzeProfileNiche = async (fullName: string, bio: string, username: string = "", url: string = ""): Promise<string> => {
  const textToAnalyze = `${fullName} ${bio} ${username} ${url}`;

  // 1. Tenta detecção rápida por palavras-chave primeiro
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
