-- ============================================
-- TRADUÇÃO DE NICHOS - Inglês → Português BR
-- Execute este script para traduzir nichos existentes
-- ============================================

-- Atualizar nichos existentes de inglês para português
UPDATE public.insta_leads
SET niche = CASE niche
    -- Negócios e Marketing
    WHEN 'Digital Marketing' THEN 'Marketing Digital'
    WHEN 'Marketing' THEN 'Marketing'
    WHEN 'E-commerce' THEN 'E-commerce'
    WHEN 'Business' THEN 'Negócios'
    WHEN 'Entrepreneurship' THEN 'Empreendedorismo'
    WHEN 'Sales' THEN 'Vendas'
    WHEN 'Consulting' THEN 'Consultoria'
    WHEN 'Coaching' THEN 'Coaching'
    WHEN 'Real Estate' THEN 'Imóveis'
    
    -- Finanças
    WHEN 'Finance' THEN 'Finanças'
    WHEN 'Investment' THEN 'Investimentos'
    WHEN 'Trading' THEN 'Trading'
    WHEN 'Cryptocurrency' THEN 'Criptomoedas'
    WHEN 'Personal Finance' THEN 'Finanças Pessoais'
    
    -- Estilo de Vida
    WHEN 'Lifestyle' THEN 'Estilo de Vida'
    WHEN 'Travel' THEN 'Viagens'
    WHEN 'Fashion' THEN 'Moda'
    WHEN 'Beauty' THEN 'Beleza'
    WHEN 'Food' THEN 'Gastronomia'
    WHEN 'Photography' THEN 'Fotografia'
    WHEN 'Art' THEN 'Arte'
    WHEN 'Music' THEN 'Música'
    
    -- Saúde e Fitness
    WHEN 'Fitness' THEN 'Fitness'
    WHEN 'Health' THEN 'Saúde'
    WHEN 'Wellness' THEN 'Bem-estar'
    WHEN 'Nutrition' THEN 'Nutrição'
    WHEN 'Yoga' THEN 'Yoga'
    WHEN 'Sports' THEN 'Esportes'
    
    -- Educação e Desenvolvimento
    WHEN 'Education' THEN 'Educação'
    WHEN 'Technology' THEN 'Tecnologia'
    WHEN 'Programming' THEN 'Programação'
    WHEN 'Design' THEN 'Design'
    WHEN 'Writing' THEN 'Escrita'
    WHEN 'Personal Development' THEN 'Desenvolvimento Pessoal'
    
    -- Profissões
    WHEN 'Law' THEN 'Direito'
    WHEN 'Medicine' THEN 'Medicina'
    WHEN 'Engineering' THEN 'Engenharia'
    WHEN 'Architecture' THEN 'Arquitetura'
    
    -- Outros
    WHEN 'Entertainment' THEN 'Entretenimento'
    WHEN 'Gaming' THEN 'Games'
    WHEN 'Parenting' THEN 'Maternidade/Paternidade'
    WHEN 'Pets' THEN 'Pets'
    WHEN 'Motivation' THEN 'Motivação'
    WHEN 'Spirituality' THEN 'Espiritualidade'
    WHEN 'General' THEN 'Geral'
    WHEN 'Uncategorized' THEN 'Não Categorizado'
    WHEN 'Analysis Failed' THEN 'Análise Falhou'
    
    -- Se não encontrar tradução, manter o original
    ELSE niche
END
WHERE niche IS NOT NULL;

-- Verificar resultados da tradução
SELECT 
    niche,
    COUNT(*) as total
FROM public.insta_leads
GROUP BY niche
ORDER BY total DESC;

-- Atualizar nichos vazios ou NULL
UPDATE public.insta_leads
SET niche = 'Não Categorizado'
WHERE niche IS NULL OR niche = '';
