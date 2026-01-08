
/**
 * Dicionário de tradução de nichos (Inglês → Português BR)
 */
export const nicheTranslations: Record<string, string> = {
    // Negócios e Marketing
    'Digital Marketing': 'Marketing Digital',
    'Marketing': 'Marketing',
    'E-commerce': 'E-commerce',
    'Business': 'Negócios',
    'Entrepreneurship': 'Empreendedorismo',
    'Sales': 'Vendas',
    'Consulting': 'Consultoria',
    'Coaching': 'Coaching',
    'Real Estate': 'Imóveis',

    // Finanças
    'Finance': 'Finanças',
    'Investment': 'Investimentos',
    'Trading': 'Trading',
    'Cryptocurrency': 'Criptomoedas',
    'Personal Finance': 'Finanças Pessoais',

    // Estilo de Vida
    'Lifestyle': 'Estilo de Vida',
    'Travel': 'Viagens',
    'Fashion': 'Moda',
    'Beauty': 'Beleza',
    'Food': 'Gastronomia',
    'Photography': 'Fotografia',
    'Art': 'Arte',
    'Music': 'Música',

    // Saúde e Fitness
    'Fitness': 'Fitness',
    'Health': 'Saúde',
    'Wellness': 'Bem-estar',
    'Nutrition': 'Nutrição',
    'Yoga': 'Yoga',
    'Sports': 'Esportes',

    // Educação e Desenvolvimento
    'Education': 'Educação',
    'Technology': 'Tecnologia',
    'Programming': 'Programação',
    'Design': 'Design',
    'Writing': 'Escrita',
    'Personal Development': 'Desenvolvimento Pessoal',

    // Profissões
    'Law': 'Direito',
    'Medicine': 'Medicina',
    'Engineering': 'Engenharia',
    'Architecture': 'Arquitetura',

    // Outros
    'Entertainment': 'Entretenimento',
    'Gaming': 'Games',
    'Parenting': 'Maternidade/Paternidade',
    'Pets': 'Pets',
    'Motivation': 'Motivação',
    'Spirituality': 'Espiritualidade',
    'General': 'Geral',
    'Uncategorized': 'Não Categorizado',
    'Analysis Failed': 'Análise Falhou',
};

/**
 * Traduz um nicho de inglês para português
 * @param niche - Nicho em inglês
 * @returns Nicho traduzido ou o original se não houver tradução
 */
export const translateNiche = (niche: string): string => {
    if (!niche) return 'Não Categorizado';

    // Busca tradução exata
    const translation = nicheTranslations[niche];
    if (translation) return translation;

    // Busca case-insensitive
    const lowerNiche = niche.toLowerCase();
    const foundKey = Object.keys(nicheTranslations).find(
        key => key.toLowerCase() === lowerNiche
    );

    if (foundKey) return nicheTranslations[foundKey];

    // Se não encontrar tradução, retorna o original
    return niche;
};

/**
 * Traduz múltiplos nichos
 * @param niches - Array de nichos em inglês
 * @returns Array de nichos traduzidos
 */
export const translateNiches = (niches: string[]): string[] => {
    return niches.map(translateNiche);
};

/**
 * Obtém lista de nichos em português (para filtros/dropdowns)
 */
export const getNichesInPortuguese = (): string[] => {
    return Object.values(nicheTranslations).sort();
};
