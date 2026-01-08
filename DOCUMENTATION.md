# 📚 Documentação Técnica - InstaAnalyzer Pro

> **Última Atualização:** 08/01/2026  
> **Versão:** 1.0.0  
> **Status:** Em Desenvolvimento Ativo

---

## 📋 Índice

1. [Visão Geral do Projeto](#-visão-geral-do-projeto)
2. [Arquitetura do Sistema](#-arquitetura-do-sistema)
3. [Stack Tecnológica](#-stack-tecnológica)
4. [Estrutura de Diretórios](#-estrutura-de-diretórios)
5. [Fluxo de Dados](#-fluxo-de-dados)
6. [Componentes Principais](#-componentes-principais)
7. [Serviços e Integrações](#-serviços-e-integrações)
8. [Tipos e Interfaces](#-tipos-e-interfaces)
9. [Configuração e Variáveis de Ambiente](#-configuração-e-variáveis-de-ambiente)
10. [Funcionalidades Implementadas](#-funcionalidades-implementadas)
11. [Roadmap e Melhorias Futuras](#-roadmap-e-melhorias-futuras)
12. [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral do Projeto

**InstaAnalyzer Pro** é uma ferramenta SaaS de automação para análise e qualificação de leads do Instagram. O sistema permite:

- ✅ Upload de listas de perfis via CSV
- ✅ Scraping automatizado de dados públicos do Instagram
- ✅ Análise inteligente de nicho usando IA (Gemini)
- ✅ Sincronização em tempo real com banco de dados (Supabase)
- ✅ Dashboard interativo com filtros e busca
- ✅ Exportação de dados em múltiplos formatos (CSV, JSON, MD)

### Objetivo Principal
Automatizar a qualificação de leads do Instagram, coletando informações como:
- Nome completo e username
- Biografia
- Nicho de atuação (detectado via IA)
- Número de seguidores
- Status de verificação
- Recência de postagem (últimos 30 dias)

---

## 🏗 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   App.tsx    │  │ ProfileTable │  │  StatsCards  │     │
│  │ (Container)  │  │  (Display)   │  │  (Metrics)   │     │
│  └──────┬───────┘  └──────────────┘  └──────────────┘     │
│         │                                                   │
└─────────┼───────────────────────────────────────────────────┘
          │
          ├─────────────────┬─────────────────┬──────────────
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Apify Service   │ │Gemini Service│ │Supabase Service  │
│  (Scraping)      │ │ (AI Analysis)│ │  (Persistence)   │
└──────────────────┘ └──────────────┘ └──────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Apify API       │ │  Gemini API  │ │  Supabase DB     │
│  (Instagram      │ │  (Niche      │ │  (PostgreSQL)    │
│   Scraper)       │ │   Detection) │ │                  │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

### Camadas da Aplicação

1. **Camada de Apresentação (UI)**
   - Componentes React com TypeScript
   - Estilização com CSS inline (sem Tailwind no momento)
   - Ícones via Lucide React

2. **Camada de Lógica de Negócio**
   - Gerenciamento de estado com React Hooks
   - Processamento de CSV
   - Cálculo de métricas e estatísticas

3. **Camada de Serviços**
   - `apifyService.ts`: Integração com API do Apify
   - `geminiService.ts`: Análise de nicho via IA
   - `supabaseService.ts`: Persistência de dados

4. **Camada de Dados**
   - Supabase (PostgreSQL) para armazenamento persistente
   - Estado local React para dados em memória

---

## 🛠 Stack Tecnológica

### Core
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 19.2.3 | Framework UI |
| **TypeScript** | ~5.8.2 | Type Safety |
| **Vite** | 6.2.0 | Build Tool & Dev Server |

### Bibliotecas e Dependências
| Biblioteca | Versão | Uso |
|------------|--------|-----|
| `lucide-react` | 0.562.0 | Ícones |
| `@google/genai` | 1.34.0 | Integração Gemini AI |
| `@supabase/supabase-js` | 2.39.7 | Cliente Supabase |

### APIs Externas
- **Apify Instagram Scraper**: Coleta de dados públicos do Instagram
- **Google Gemini 3 Flash**: Análise de nicho via IA
- **Supabase**: Banco de dados PostgreSQL gerenciado

---

## 📁 Estrutura de Diretórios

```
ANALISTA-DE-INSTAGRAM/
│
├── components/                    # Componentes React
│   ├── ProfileTable.tsx          # Tabela de perfis com filtros
│   └── StatsCards.tsx            # Cards de estatísticas
│
├── services/                      # Camada de serviços
│   ├── apifyService.ts           # Integração Apify (Scraping)
│   ├── geminiService.ts          # Integração Gemini (IA)
│   └── supabaseService.ts        # Integração Supabase (DB)
│
├── App.tsx                        # Componente principal
├── index.tsx                      # Entry point
├── types.ts                       # Definições TypeScript
│
├── .env.local                     # Variáveis de ambiente (não versionado)
├── .gitignore                     # Arquivos ignorados pelo Git
├── package.json                   # Dependências do projeto
├── tsconfig.json                  # Configuração TypeScript
├── vite.config.ts                 # Configuração Vite
│
├── PLANNING.md                    # Planejamento do projeto
├── GEMINI.md                      # Contexto para IA
├── README.md                      # Documentação básica
└── DOCUMENTATION.md               # Este arquivo
```

---

## 🔄 Fluxo de Dados

### 1. Upload de CSV
```
Usuário → Input File → FileReader API → Parser CSV → Array de URLs
```

### 2. Scraping e Processamento
```
URLs → Apify Service (Modo Demo) → Mock Data Generation
                                  ↓
                        InstagramProfile Objects
                                  ↓
                        Gemini Service (Opcional)
                                  ↓
                        Niche Detection via AI
                                  ↓
                        Supabase Service
                                  ↓
                        Persistência no DB
```

### 3. Sincronização Incremental
```
A cada 5 perfis processados:
  profiles[] → saveLeadsToDB() → Supabase (upsert)
```

### 4. Carregamento do Banco
```
Botão "Carregar do Banco" → fetchLeadsFromDB() → Supabase Query
                                                ↓
                                        Atualiza State
```

### 5. Exportação
```
profiles[] → handleExport(format) → Blob Creation → Download
```

---

## 🧩 Componentes Principais

### `App.tsx` (Container Principal)

**Responsabilidades:**
- Gerenciamento de estado global da aplicação
- Orquestração de upload, scraping e exportação
- Renderização condicional de UI (empty state, loading, dashboard)

**Estados Principais:**
```typescript
const [profiles, setProfiles] = useState<InstagramProfile[]>([]);
const [isScraping, setIsScraping] = useState(false);
const [progress, setProgress] = useState(0);
const [apifyToken, setApifyToken] = useState('');
const [isDemoMode, setIsDemoMode] = useState(true);
const [error, setError] = useState<string | null>(null);
const [isSyncing, setIsSyncing] = useState(false);
```

**Funções Principais:**
- `handleFileUpload()`: Processa upload de CSV
- `startScraping()`: Inicia processo de scraping
- `loadFromDatabase()`: Carrega dados do Supabase
- `handleExport()`: Exporta dados em CSV/JSON/MD

---

### `ProfileTable.tsx` (Tabela de Perfis)

**Responsabilidades:**
- Exibição de perfis em formato tabular
- Filtros (busca por texto, verificados/não verificados)
- Cálculo de dias desde última postagem
- Badges de atividade coloridos

**Features:**
- ✅ Busca em tempo real (nome, username, nicho)
- ✅ Filtro por status de verificação
- ✅ Badges de atividade (15D, 30D, 45D, 60D, +90D)
- ✅ Exibição de biografia com truncamento
- ✅ Links externos para perfis

**Cálculo de Atividade:**
```typescript
const calculateDaysSince = (dateString?: string) => {
  if (!dateString) return null;
  const lastDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
```

---

### `StatsCards.tsx` (Cards de Estatísticas)

**Responsabilidades:**
- Exibição de métricas agregadas
- Visualização de KPIs principais

**Métricas Exibidas:**
1. **Total Perfis**: Quantidade total de perfis carregados
2. **Verificados**: Perfis com badge de verificação
3. **Média Seguidores**: Média aritmética de seguidores
4. **Ativos (30d)**: Perfis que postaram nos últimos 30 dias

---

## 🔌 Serviços e Integrações

### `apifyService.ts`

**Status Atual:** Modo Demo (Simulação)

**Função Principal:**
```typescript
export const runInstagramScraper = async (
  urls: string[], 
  apifyToken: string,
  onProgress: (profiles: InstagramProfile[]) => void
) => {
  if (!apifyToken || apifyToken === 'DEMO') {
    return simulateScraping(urls, onProgress);
  }
  // TODO: Implementar integração real com Apify API
}
```

**Simulação de Dados:**
- Gera perfis mock com dados realistas
- Delay de 600ms por perfil (simula latência de API)
- Bios únicas geradas combinando templates
- Datas de postagem aleatórias (0-95 dias atrás)
- Seguidores aleatórios (500-80.500)
- 20% de chance de perfil verificado

**Próximos Passos:**
- [ ] Implementar chamada real à API do Apify
- [ ] Adicionar tratamento de erros robusto
- [ ] Implementar retry logic
- [ ] Adicionar rate limiting

---

### `geminiService.ts`

**Status Atual:** Configurado mas não utilizado ativamente

**Funções Disponíveis:**

1. **Análise Individual:**
```typescript
export const analyzeProfileNiche = async (
  fullName: string, 
  bio: string
): Promise<string>
```

2. **Análise em Lote:**
```typescript
export const batchAnalyzeNiches = async (
  profiles: { fullName: string; bio: string }[]
)
```

**Configuração:**
- Modelo: `gemini-3-flash-preview`
- Max Tokens: 20 (análise individual)
- Temperature: 0.1 (baixa criatividade)
- Response Format: JSON (batch)

**Problema Atual:**
⚠️ A variável de ambiente `process.env.API_KEY` não está sendo lida corretamente no ambiente Vite. Deve ser `import.meta.env.VITE_GEMINI_API_KEY`.

**Correção Necessária:**
```typescript
// Antes:
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Depois:
const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' 
});
```

---

### `supabaseService.ts`

**Status Atual:** Funcional e Ativo

**Configuração:**
```typescript
const SUPABASE_URL = 'https://sua-url.supabase.co';
const SUPABASE_KEY = 'sua-chave-aqui';
```

**Funções:**

1. **Salvar Leads:**
```typescript
export const saveLeadsToDB = async (profiles: InstagramProfile[])
```
- Usa `upsert` com conflito em `url` (evita duplicatas)
- Mapeia campos do frontend para schema do DB

2. **Buscar Leads:**
```typescript
export const fetchLeadsFromDB = async (): Promise<InstagramProfile[]>
```
- Ordena por `created_at` descendente
- Mapeia campos do DB para interface frontend

**Schema da Tabela `insta_leads`:**
```sql
CREATE TABLE insta_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  username TEXT,
  full_name TEXT,
  bio TEXT,
  followers_count INTEGER,
  is_verified BOOLEAN,
  niche TEXT,
  has_posted_recently BOOLEAN,
  last_post_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📐 Tipos e Interfaces

### `InstagramProfile`
```typescript
export interface InstagramProfile {
  id: string;                    // ID único gerado
  url: string;                   // URL do perfil
  fullName: string;              // Nome completo
  username: string;              // @username
  biography: string;             // Bio do perfil
  followersCount: number;        // Número de seguidores
  isVerified: boolean;           // Badge de verificação
  niche: string;                 // Nicho detectado
  hasPostedRecently: boolean;    // Postou nos últimos 30 dias
  lastPostDate?: string;         // Data do último post (ISO)
  profilePicUrl?: string;        // URL da foto de perfil
  status: 'pending' | 'processing' | 'completed' | 'error';
}
```

### `ScrapingStats`
```typescript
export interface ScrapingStats {
  total: number;              // Total de perfis
  processed: number;          // Perfis processados
  verifiedCount: number;      // Perfis verificados
  avgFollowers: number;       // Média de seguidores
  activeLast30Days: number;   // Ativos nos últimos 30 dias
}
```

### `ApifyConfig`
```typescript
export interface ApifyConfig {
  apiKey: string;    // Token da API Apify
  actorId: string;   // ID do Actor (apify/instagram-scraper)
}
```

---

## ⚙️ Configuração e Variáveis de Ambiente

### Arquivo `.env.local`

```env
# Gemini API (Google AI)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Apify API (Instagram Scraper)
VITE_APIFY_API_TOKEN=your_apify_token_here
```

### Variáveis Hardcoded (Supabase)

⚠️ **Atenção:** As credenciais do Supabase estão hardcoded em `supabaseService.ts`. Para produção, mova para `.env.local`:

```env
VITE_SUPABASE_URL=https://sua-url.supabase.co
VITE_SUPABASE_KEY=sua-chave-aqui
```

E atualize o código:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
```

---

## ✨ Funcionalidades Implementadas

### ✅ Concluídas

1. **Upload de CSV**
   - Drag & Drop (via input file)
   - Parsing de URLs do Instagram
   - Validação de formato

2. **Scraping (Modo Demo)**
   - Simulação de dados realistas
   - Progresso em tempo real
   - Callback para atualização de UI

3. **Dashboard Interativo**
   - Tabela de perfis
   - Cards de estatísticas
   - Busca e filtros

4. **Sincronização com Banco**
   - Salvamento incremental (a cada 5 perfis)
   - Carregamento de dados salvos
   - Upsert para evitar duplicatas

5. **Exportação de Dados**
   - CSV (com headers)
   - JSON (formatado)
   - Markdown (tabela)

6. **UI/UX**
   - Design moderno e responsivo
   - Estados de loading
   - Mensagens de erro
   - Badges de atividade coloridos

### 🚧 Em Desenvolvimento

1. **Integração Real com Apify**
   - Chamadas à API do Apify
   - Tratamento de rate limits
   - Retry logic

2. **Análise de Nicho via IA**
   - Correção de variáveis de ambiente
   - Integração com Gemini
   - Batch processing

### 📋 Planejadas

1. **Autenticação de Usuários**
   - Login/Signup
   - Gestão de sessões
   - Limites por usuário

2. **Histórico de Scraping**
   - Listagem de jobs anteriores
   - Comparação de resultados
   - Análise de tendências

3. **Webhooks e Notificações**
   - Alertas de conclusão
   - Relatórios por email

4. **Analytics Avançado**
   - Gráficos de crescimento
   - Segmentação por nicho
   - Insights de IA

---

## 🗺 Roadmap e Melhorias Futuras

### Curto Prazo (1-2 semanas)

- [ ] **Corrigir integração Gemini**
  - Atualizar variáveis de ambiente
  - Testar análise de nicho
  - Implementar fallback

- [ ] **Implementar Apify real**
  - Configurar Actor do Instagram
  - Adicionar tratamento de erros
  - Testar com lista real de 135 URLs

- [ ] **Melhorar UX**
  - Adicionar skeleton loaders
  - Implementar toast notifications
  - Melhorar responsividade mobile

### Médio Prazo (1 mês)

- [ ] **Sistema de Autenticação**
  - Supabase Auth
  - Gestão de perfis
  - Limites por plano

- [ ] **Dashboard Avançado**
  - Gráficos com Chart.js
  - Filtros avançados
  - Exportação em PDF

- [ ] **Otimizações**
  - Lazy loading de componentes
  - Virtualização de tabela
  - Cache de dados

### Longo Prazo (3+ meses)

- [ ] **Multi-plataforma**
  - Suporte a TikTok
  - Suporte a LinkedIn
  - Suporte a Twitter/X

- [ ] **IA Avançada**
  - Análise de sentimento
  - Predição de engajamento
  - Recomendações de outreach

- [ ] **Automação de Outreach**
  - Templates de mensagem
  - Agendamento de contatos
  - CRM integrado

---

## 🔧 Troubleshooting

### Problema: "API key not valid" (Gemini)

**Causa:** Variável de ambiente não está sendo lida corretamente.

**Solução:**
1. Verificar se `.env.local` existe e contém `VITE_GEMINI_API_KEY`
2. Atualizar `geminiService.ts` para usar `import.meta.env.VITE_GEMINI_API_KEY`
3. Reiniciar o servidor de desenvolvimento

---

### Problema: Dados não aparecem após upload

**Causa:** Modo Demo pode estar desabilitado sem token válido do Apify.

**Solução:**
1. Verificar se `isDemoMode` está `true`
2. Ou adicionar token válido do Apify em `.env.local`
3. Verificar console do navegador para erros

---

### Problema: Erro ao salvar no Supabase

**Causa:** Schema da tabela pode não corresponder aos campos enviados.

**Solução:**
1. Verificar logs no console
2. Confirmar schema da tabela `insta_leads`
3. Verificar mapeamento de campos em `supabaseService.ts`

---

### Problema: Build falha

**Causa:** Dependências desatualizadas ou conflitos de versão.

**Solução:**
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou usar npm ci para instalação limpa
npm ci
```

---

## 📞 Contato e Suporte

Para dúvidas ou sugestões sobre este projeto, consulte:
- **PLANNING.md**: Roadmap detalhado
- **GEMINI.md**: Contexto para IA
- **README.md**: Instruções básicas de uso

---

## 📄 Licença

Este projeto é de uso interno e proprietário.

---

**Última Atualização:** 08/01/2026 às 15:04 BRT  
**Mantido por:** Pedro Leon (O Mago)
