
import { InstagramProfile } from '../types';
import { batchAnalyzeNiches } from './geminiService';

/**
 * Executa scraping de perfis do Instagram usando Apify
 * @param urls - Array de URLs de perfis do Instagram
 * @param apifyToken - Token da API do Apify
 * @param onProgress - Callback para atualizar progresso
 */
export const runInstagramScraper = async (
  urls: string[],
  apifyToken: string,
  onProgress: (profiles: InstagramProfile[]) => void
) => {
  // Se não tiver token ou for DEMO, usa simulação
  if (!apifyToken || apifyToken === 'DEMO') {
    console.log('🎭 Modo DEMO ativado - usando dados simulados');
    return simulateScraping(urls, onProgress);
  }

  // ✅ SCRAPING REAL COM APIFY
  console.log('🚀 Iniciando scraping REAL com Apify...');
  console.log(`📊 Total de URLs: ${urls.length}`);

  try {
    const results: InstagramProfile[] = [];

    // Processar em lotes de 10 URLs por vez (limite do Apify)
    const batchSize = 10;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      console.log(`📦 Processando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(urls.length / batchSize)}`);

      // 1. Scraping dos dados brutos
      const batchResults = await scrapeInstagramProfiles(batch, apifyToken);

      // 2. Análise de Nicho com IA (Gemini) em lote
      console.log('🤖 Analisando nichos com Gemini...');
      const profilesToAnalyze = batchResults.map(p => ({
        fullName: p.fullName,
        bio: p.biography,
        username: p.username,
        url: p.url
      }));

      const niches = await batchAnalyzeNiches(profilesToAnalyze);

      // 3. Atualizar perfis com os nichos encontrados
      batchResults.forEach((profile, index) => {
        profile.niche = niches[index] || "Geral";
      });

      results.push(...batchResults);

      // Atualizar progresso
      onProgress([...results]);
    }

    console.log(`✅ Scraping concluído! ${results.length} perfis coletados`);
    return results;

  } catch (error) {
    console.error('❌ Erro no scraping real:', error);
    console.log('🎭 Voltando para modo simulado...');
    return simulateScraping(urls, onProgress);
  }
};

/**
 * Faz scraping de um lote de perfis usando Apify API
 */
const scrapeInstagramProfiles = async (
  urls: string[],
  apifyToken: string
): Promise<InstagramProfile[]> => {
  const APIFY_API_URL = 'https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items';

  // Calcular data de 30 dias atrás para o filtro do Apify
  const thirtyDaysAgoDate = new Date();
  thirtyDaysAgoDate.setDate(thirtyDaysAgoDate.getDate() - 30);
  const formattedDate = thirtyDaysAgoDate.toISOString().split('T')[0];

  const requestBody = {
    directUrls: urls,
    resultsType: 'details', // ✅ Atualizado conforme exemplo do usuário
    resultsLimit: 1,        // 1 resultado por URL (o perfil)
    searchLimit: 1,
    searchType: 'user',
    onlyPostsNewerThan: formattedDate, // ✅ Otimização: posts dos últimos 30 dias
    addParentData: false
  };

  console.log('📡 Enviando requisição para Apify (Modo Detalhado)...');

  const response = await fetch(`${APIFY_API_URL}?token=${apifyToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apify API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`✅ Apify retornou ${data.length} itens`);

  // 1. Mapeamento inicial com "Análise Pendente"
  const profiles: InstagramProfile[] = data.map((item: any, index: number) => {
    // Capturar biografia e link externo para montar a bio completa
    const rawBio = item.biography || '';
    const externalUrl = item.externalUrl || '';

    // Adiciona o link ao final da bio se existir (como no app do Instagram)
    const fullBio = externalUrl ? `${rawBio}\n\n🔗 ${externalUrl}` : rawBio;

    return {
      id: item.id || Math.random().toString(36).substr(2, 9),
      url: item.url || urls[index],
      username: item.username || extractUsernameFromUrl(urls[index]),
      fullName: item.fullName || item.username || '',
      biography: fullBio,
      followersCount: item.followersCount || 0,
      isVerified: item.verified || false, // ✅ Apify usa 'verified'
      niche: 'Analisando...', // ✅ Placeholder enquanto o Gemini processa
      hasPostedRecently: checkRecentPost(item.latestPosts),
      lastPostDate: getLastPostDate(item.latestPosts),
      profilePicUrl: item.profilePicUrlHD || item.profilePicUrl, // ✅ Prefere HD
      status: 'completed'
    };
  });

  // 2. Enriquecimento com IA (Gemini)
  console.log('🤖 Iniciando análise de nicho com IA...');
  try {
    const profilesToAnalyze = profiles.map(p => ({
      username: p.username,
      fullName: p.fullName,
      bio: p.biography
    }));

    const niches = await batchAnalyzeNiches(profilesToAnalyze);

    // Atualizar perfis com os nichos encontrados
    profiles.forEach((profile, index) => {
      profile.niche = niches[index] || 'Não Identificado';
    });

    console.log('✨ Análise de nicho concluída!');
  } catch (error) {
    console.error('⚠️ Falha ao analisar nichos com IA:', error);
    // Fallback silencioso mantendo "Analisando..." ou mudando para "Não Identificado"
    profiles.forEach(p => p.niche = 'Não Identificado');
  }

  // 3. Retornar perfis enriquecidos
  profiles.forEach(p => {
    console.log(`✅ Perfil mapeado: @${p.username} - ${p.followersCount} seguidores - Nicho: ${p.niche}`);
  });

  return profiles;
};

/**
 * Extrai username da URL do Instagram
 */
const extractUsernameFromUrl = (url: string): string => {
  const match = url.match(/instagram\.com\/([^\/\?]+)/);
  return match ? match[1] : '';
};

/**
 * Verifica se o perfil postou recentemente (últimos 30 dias)
 */
const checkRecentPost = (latestPosts: any[]): boolean => {
  if (!latestPosts || latestPosts.length === 0) return false;

  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  return latestPosts.some(post => {
    const postDate = new Date(post.timestamp || post.date).getTime();
    return postDate >= thirtyDaysAgo;
  });
};

/**
 * Obtém data do último post
 */
const getLastPostDate = (latestPosts: any[]): string | undefined => {
  if (!latestPosts || latestPosts.length === 0) return undefined;

  const dates = latestPosts
    .map(post => new Date(post.timestamp || post.date).getTime())
    .filter(date => !isNaN(date));

  if (dates.length === 0) return undefined;

  const mostRecent = Math.max(...dates);
  return new Date(mostRecent).toISOString();
};

const simulateScraping = async (urls: string[], onProgress: (profiles: InstagramProfile[]) => void) => {
  // ✅ Nichos em Português BR
  const niches = [
    "Fitness",
    "Marketing Digital",
    "Direito",
    "Finanças",
    "Estilo de Vida",
    "E-commerce",
    "Viagens",
    "Consultoria",
    "Coaching",
    "Saúde",
    "Tecnologia",
    "Moda"
  ];

  const results: InstagramProfile[] = [];

  for (let i = 0; i < urls.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 600));

    const url = urls[i];
    const username = url.split('/').pop()?.replace(/\/$/, '') || `user_${i}`;

    // ✅ Biografia genérica para simulação
    const bio = "Biografia simulada para testes (Modo DEMO).\nAdicione um token válido do Apify para ver dados reais.";

    // Gerar data precisa (de 0 a 90 dias atrás)
    const daysAgo = Math.floor(Math.random() * 95);
    const lastPostDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    const mockProfile: InstagramProfile = {
      id: Math.random().toString(36).substr(2, 9),
      url: url,
      username: username,
      fullName: username.replace(/[._]/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      biography: bio,
      followersCount: Math.floor(Math.random() * 80000) + 500,
      isVerified: Math.random() > 0.8,
      niche: niches[Math.floor(Math.random() * niches.length)],
      hasPostedRecently: daysAgo <= 30,
      lastPostDate: lastPostDate,
      status: 'completed'
    };

    results.push(mockProfile);
    onProgress([...results]);
  }

  return results;
};