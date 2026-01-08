
import { InstagramProfile } from '../types';

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
  // Se for explicitamente DEMO, usa simulação
  if (apifyToken === 'DEMO') {
    console.log('🎭 Modo DEMO ativado - usando dados simulados');
    return simulateScraping(urls, onProgress);
  }

  // Validação estrita do token
  if (!apifyToken) {
    throw new Error('Token da API do Apify não configurado. Adicione VITE_APIFY_API_TOKEN no .env.local');
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

      const batchResults = await scrapeInstagramProfiles(batch, apifyToken);
      results.push(...batchResults);

      // Atualizar progresso
      onProgress([...results]);
    }

    console.log(`✅ Scraping concluído! ${results.length} perfis coletados`);
    return results;

  } catch (error) {
    console.error('❌ Erro no scraping real:', error);
    // Não faz mais fallback para simulação
    throw error;
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

  const requestBody = {
    directUrls: urls,
    resultsType: 'profiles',
    resultsLimit: urls.length,
    searchType: 'user',
    searchLimit: 1,
    addParentData: false
  };

  console.log('📡 Enviando requisição para Apify...');

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
  console.log(`✅ Apify retornou ${data.length} perfis`);

  // Mapear dados do Apify para nosso formato
  return data.map((item: any, index: number) => {
    // Capturar biografia e link externo para montar a bio completa
    const rawBio = item.biography || '';
    const externalUrl = item.externalUrl || '';

    // Adiciona o link ao final da bio se existir (como no app do Instagram)
    const fullBio = externalUrl ? `${rawBio}\n\n🔗 ${externalUrl}` : rawBio;

    const profile: InstagramProfile = {
      id: item.id || Math.random().toString(36).substr(2, 9),
      url: item.url || urls[index],
      username: item.username || extractUsernameFromUrl(urls[index]),
      fullName: item.fullName || item.username || '',
      biography: fullBio, // ✅ Bio + Link
      followersCount: item.followersCount || 0,
      isVerified: item.verified || false,
      niche: 'Não Categorizado', // Será classificado depois via IA
      hasPostedRecently: checkRecentPost(item.latestPosts),
      lastPostDate: getLastPostDate(item.latestPosts),
      profilePicUrl: item.profilePicUrl,
      status: 'completed'
    };

    console.log(`✅ Perfil mapeado: @${profile.username} - ${profile.followersCount} seguidores`);
    return profile;
  });
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