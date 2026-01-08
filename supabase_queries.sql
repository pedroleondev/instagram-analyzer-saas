-- ============================================
-- QUERIES ÚTEIS - InstaAnalyzer Pro
-- Tabela: insta_leads
-- Projeto Supabase: owyaewqdehhparheemdd
-- ============================================

-- ============================================
-- 1. VERIFICAR ESTRUTURA DA TABELA
-- ============================================

-- Ver todas as colunas e seus tipos
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'insta_leads'
ORDER BY ordinal_position;


-- ============================================
-- 2. CONSULTAS DE DADOS
-- ============================================

-- Ver todos os leads (limitado a 100)
SELECT * FROM public.insta_leads
ORDER BY created_at DESC
LIMIT 100;

-- Contar total de leads
SELECT COUNT(*) as total_leads FROM public.insta_leads;

-- Ver leads verificados
SELECT 
    username, 
    full_name, 
    followers_count, 
    niche
FROM public.insta_leads
WHERE is_verified = true
ORDER BY followers_count DESC;

-- Ver leads ativos (postaram recentemente)
SELECT 
    username, 
    full_name, 
    last_post_date,
    niche
FROM public.insta_leads
WHERE has_posted_recently = true
ORDER BY last_post_date DESC;

-- Estatísticas por nicho
SELECT 
    niche,
    COUNT(*) as total,
    AVG(followers_count) as avg_followers,
    SUM(CASE WHEN is_verified THEN 1 ELSE 0 END) as verified_count
FROM public.insta_leads
GROUP BY niche
ORDER BY total DESC;


-- ============================================
-- 3. LIMPEZA E MANUTENÇÃO
-- ============================================

-- Deletar todos os dados (CUIDADO!)
-- DELETE FROM public.insta_leads;

-- Deletar leads duplicados (manter o mais recente)
DELETE FROM public.insta_leads a
USING public.insta_leads b
WHERE a.id < b.id 
  AND a.url = b.url;

-- Deletar leads sem username
DELETE FROM public.insta_leads
WHERE username IS NULL OR username = '';

-- Resetar a tabela completamente (CUIDADO!)
-- TRUNCATE TABLE public.insta_leads RESTART IDENTITY;


-- ============================================
-- 4. ATUALIZAÇÕES EM MASSA
-- ============================================

-- Atualizar nicho de leads sem classificação
UPDATE public.insta_leads
SET niche = 'Uncategorized'
WHERE niche IS NULL OR niche = '';

-- Marcar leads antigos como inativos
UPDATE public.insta_leads
SET has_posted_recently = false
WHERE last_post_date < NOW() - INTERVAL '30 days';

-- Atualizar updated_at manualmente (se necessário)
UPDATE public.insta_leads
SET updated_at = NOW()
WHERE id = 'seu-id-aqui';


-- ============================================
-- 5. INSERÇÃO MANUAL DE TESTE
-- ============================================

-- Inserir um lead de teste
INSERT INTO public.insta_leads (
    url,
    username,
    full_name,
    status_bio,
    followers_count,
    is_verified,
    niche,
    has_posted_recently,
    last_post_date
) VALUES (
    'https://instagram.com/teste_usuario',
    'teste_usuario',
    'Usuário de Teste',
    '🚀 Testando o sistema | Desenvolvedor',
    1000,
    false,
    'Technology',
    true,
    NOW() - INTERVAL '5 days'
);


-- ============================================
-- 6. ANÁLISES E RELATÓRIOS
-- ============================================

-- Top 10 perfis por seguidores
SELECT 
    username,
    full_name,
    followers_count,
    is_verified,
    niche
FROM public.insta_leads
ORDER BY followers_count DESC
LIMIT 10;

-- Leads adicionados hoje
SELECT COUNT(*) as leads_hoje
FROM public.insta_leads
WHERE DATE(created_at) = CURRENT_DATE;

-- Leads por dia (últimos 7 dias)
SELECT 
    DATE(created_at) as data,
    COUNT(*) as total
FROM public.insta_leads
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- Taxa de verificação por nicho
SELECT 
    niche,
    COUNT(*) as total,
    SUM(CASE WHEN is_verified THEN 1 ELSE 0 END) as verified,
    ROUND(100.0 * SUM(CASE WHEN is_verified THEN 1 ELSE 0 END) / COUNT(*), 2) as verification_rate
FROM public.insta_leads
GROUP BY niche
HAVING COUNT(*) >= 5
ORDER BY verification_rate DESC;


-- ============================================
-- 7. BACKUP E EXPORTAÇÃO
-- ============================================

-- Exportar todos os dados em formato JSON
SELECT json_agg(row_to_json(t))
FROM (
    SELECT * FROM public.insta_leads
    ORDER BY created_at DESC
) t;

-- Exportar apenas campos essenciais
SELECT 
    url,
    username,
    full_name,
    followers_count,
    is_verified,
    niche
FROM public.insta_leads
ORDER BY created_at DESC;


-- ============================================
-- 8. VERIFICAÇÃO DE INTEGRIDADE
-- ============================================

-- Verificar URLs duplicadas
SELECT 
    url, 
    COUNT(*) as duplicates
FROM public.insta_leads
GROUP BY url
HAVING COUNT(*) > 1;

-- Verificar dados inconsistentes
SELECT 
    id,
    url,
    username,
    full_name
FROM public.insta_leads
WHERE 
    url IS NULL OR
    username IS NULL OR
    full_name IS NULL OR
    followers_count < 0;

-- Verificar leads sem nicho
SELECT COUNT(*) as sem_nicho
FROM public.insta_leads
WHERE niche IS NULL OR niche = '' OR niche = 'Uncategorized';


-- ============================================
-- 9. PERFORMANCE E ÍNDICES
-- ============================================

-- Ver índices existentes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'insta_leads';

-- Analisar uso de espaço
SELECT 
    pg_size_pretty(pg_total_relation_size('public.insta_leads')) as total_size,
    pg_size_pretty(pg_relation_size('public.insta_leads')) as table_size,
    pg_size_pretty(pg_indexes_size('public.insta_leads')) as indexes_size;


-- ============================================
-- 10. QUERIES DE DEBUG
-- ============================================

-- Ver último lead inserido
SELECT * FROM public.insta_leads
ORDER BY created_at DESC
LIMIT 1;

-- Ver leads com erros (sem dados essenciais)
SELECT 
    id,
    url,
    username,
    full_name,
    created_at
FROM public.insta_leads
WHERE 
    username IS NULL OR 
    full_name IS NULL OR
    status_bio IS NULL
ORDER BY created_at DESC;

-- Verificar distribuição de datas de posts
SELECT 
    CASE 
        WHEN last_post_date >= NOW() - INTERVAL '7 days' THEN 'Última semana'
        WHEN last_post_date >= NOW() - INTERVAL '30 days' THEN 'Último mês'
        WHEN last_post_date >= NOW() - INTERVAL '90 days' THEN 'Últimos 3 meses'
        ELSE 'Mais de 3 meses'
    END as periodo,
    COUNT(*) as total
FROM public.insta_leads
WHERE last_post_date IS NOT NULL
GROUP BY periodo
ORDER BY 
    CASE periodo
        WHEN 'Última semana' THEN 1
        WHEN 'Último mês' THEN 2
        WHEN 'Últimos 3 meses' THEN 3
        ELSE 4
    END;


-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
SCHEMA DA TABELA:
- id: UUID (PK, auto-gerado)
- url: TEXT (UNIQUE, NOT NULL) - Chave de conflito para upsert
- username: TEXT
- full_name: TEXT
- status_bio: TEXT (⚠️ ATENÇÃO: campo é 'status_bio', não 'bio')
- followers_count: BIGINT
- is_verified: BOOLEAN (default: false)
- niche: TEXT
- has_posted_recently: BOOLEAN (default: false)
- last_post_date: TIMESTAMPTZ
- profile_pic_url: TEXT
- created_at: TIMESTAMPTZ (default: now())
- updated_at: TIMESTAMPTZ (default: now(), auto-atualizado)

ÍNDICES:
- idx_insta_leads_url (url)
- idx_insta_leads_username (username)

TRIGGERS:
- update_insta_leads_updated_at: Atualiza updated_at automaticamente
*/
