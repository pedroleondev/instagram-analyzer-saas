# 🚀 Guia Rápido de Referência - InstaAnalyzer Pro

> **Cheat Sheet para desenvolvimento rápido**

---

## 📁 Estrutura de Arquivos (Mapa Mental)

```
ANALISTA-DE-INSTAGRAM/
│
├── 📄 Documentação
│   ├── README.md              → Início rápido
│   ├── DOCUMENTATION.md       → Docs técnica completa
│   ├── PROJECT_STATUS.md      → Status e métricas
│   ├── PLANNING.md            → Roadmap
│   ├── GEMINI.md              → Contexto para IA
│   └── QUICK_REFERENCE.md     → Este arquivo
│
├── 🎨 Frontend (React)
│   ├── App.tsx                → Container principal (326 linhas)
│   ├── index.tsx              → Entry point
│   ├── components/
│   │   ├── ProfileTable.tsx   → Tabela de perfis (150 linhas)
│   │   └── StatsCards.tsx     → Cards de métricas (60 linhas)
│   └── types.ts               → Interfaces TypeScript
│
├── ⚙️ Services (Backend Logic)
│   ├── apifyService.ts        → Scraping (60 linhas) ⚠️ Mock ativo
│   ├── geminiService.ts       → IA (53 linhas) ⚠️ Var incorreta
│   └── supabaseService.ts     → DB (61 linhas) ✅ Funcional
│
└── 🔧 Configuração
    ├── package.json           → Dependências
    ├── tsconfig.json          → TypeScript
    ├── vite.config.ts         → Vite
    └── .env.local             → Variáveis de ambiente
```

---

## ⚡ Comandos Essenciais

```bash
# Desenvolvimento
npm run dev              # Inicia servidor local (localhost:5173)
npm run build            # Build de produção
npm run preview          # Preview do build

# Instalação
npm install              # Instala dependências
npm ci                   # Instalação limpa (CI/CD)

# Limpeza
rm -rf node_modules      # Remove node_modules
npm cache clean --force  # Limpa cache do npm
```

---

## 🔑 Variáveis de Ambiente (.env.local)

```env
# Gemini AI (Google)
VITE_GEMINI_API_KEY=AIza...

# Apify (Instagram Scraper)
VITE_APIFY_API_TOKEN=apify_api_...

# Supabase (Banco de Dados)
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_KEY=eyJhbG...
```

**⚠️ Importante:** Sempre use prefixo `VITE_` para variáveis acessíveis no frontend.

---

## 🗂 Interfaces TypeScript Principais

### InstagramProfile
```typescript
interface InstagramProfile {
  id: string;
  url: string;
  fullName: string;
  username: string;
  biography: string;
  followersCount: number;
  isVerified: boolean;
  niche: string;
  hasPostedRecently: boolean;
  lastPostDate?: string;
  profilePicUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}
```

### ScrapingStats
```typescript
interface ScrapingStats {
  total: number;
  processed: number;
  verifiedCount: number;
  avgFollowers: number;
  activeLast30Days: number;
}
```

---

## 🔌 APIs e Serviços

### Supabase (Banco de Dados)
```typescript
// Salvar leads
await saveLeadsToDB(profiles);

// Buscar leads
const leads = await fetchLeadsFromDB();
```

**Tabela:** `insta_leads`  
**Colunas:** `id`, `url`, `username`, `full_name`, `bio`, `followers_count`, `is_verified`, `niche`, `has_posted_recently`, `last_post_date`, `created_at`

---

### Gemini AI (Análise de Nicho)
```typescript
// Análise individual
const niche = await analyzeProfileNiche(fullName, bio);

// Análise em lote
const niches = await batchAnalyzeNiches(profiles);
```

**Modelo:** `gemini-3-flash-preview`  
**Status:** ⚠️ Variável de ambiente incorreta

---

### Apify (Scraping)
```typescript
// Executar scraping
await runInstagramScraper(urls, token, onProgress);
```

**Status:** ⚠️ Sempre retorna mock (simulação)

---

## 🎨 Componentes React

### App.tsx (Container)
**Estados principais:**
```typescript
const [profiles, setProfiles] = useState<InstagramProfile[]>([]);
const [isScraping, setIsScraping] = useState(false);
const [progress, setProgress] = useState(0);
const [isDemoMode, setIsDemoMode] = useState(true);
```

**Funções principais:**
- `handleFileUpload()` - Processa CSV
- `startScraping()` - Inicia scraping
- `loadFromDatabase()` - Carrega do Supabase
- `handleExport()` - Exporta dados

---

### ProfileTable.tsx
**Props:**
```typescript
interface ProfileTableProps {
  profiles: InstagramProfile[];
  onExport: (format: 'csv' | 'json' | 'md') => void;
}
```

**Features:**
- Busca em tempo real
- Filtro por verificação
- Badges de atividade (15D, 30D, 45D, 60D, +90D)

---

### StatsCards.tsx
**Props:**
```typescript
interface StatsCardsProps {
  stats: ScrapingStats;
}
```

**Métricas:**
- Total Perfis
- Verificados
- Média Seguidores
- Ativos (30d)

---

## 🐛 Problemas Conhecidos (Quick Fix)

### 1. Gemini não funciona
**Arquivo:** `services/geminiService.ts:4`

```typescript
// ❌ Errado
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// ✅ Correto
const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' 
});
```

---

### 2. Apify sempre retorna mock
**Arquivo:** `services/apifyService.ts:9-12`

```typescript
// ❌ Problema
if (!apifyToken || apifyToken === 'DEMO') {
  return simulateScraping(urls, onProgress);
}
return simulateScraping(urls, onProgress); // ← Sempre mock

// ✅ Solução
if (!apifyToken || apifyToken === 'DEMO') {
  return simulateScraping(urls, onProgress);
}
// TODO: Implementar chamada real à API Apify
return callApifyAPI(urls, apifyToken, onProgress);
```

---

### 3. Credenciais hardcoded
**Arquivo:** `services/supabaseService.ts:5-6`

```typescript
// ❌ Hardcoded
const SUPABASE_URL = 'https://sua-url.supabase.co';
const SUPABASE_KEY = 'sua-chave-aqui';

// ✅ Usar .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
```

---

## 📊 Fluxo de Dados (Resumido)

```
1. Upload CSV
   └─→ FileReader → Parser → Array de URLs

2. Scraping
   └─→ Apify Service (Mock) → InstagramProfile[]

3. Análise IA (Opcional)
   └─→ Gemini Service → Niche Detection

4. Persistência
   └─→ Supabase Service → DB (upsert)

5. Visualização
   └─→ ProfileTable + StatsCards

6. Exportação
   └─→ CSV / JSON / MD
```

---

## 🎯 Checklist de Desenvolvimento

### Antes de Começar
- [ ] `npm install` executado
- [ ] `.env.local` configurado
- [ ] Servidor dev rodando (`npm run dev`)

### Ao Adicionar Nova Feature
- [ ] Criar/atualizar interface em `types.ts`
- [ ] Implementar lógica em `App.tsx` ou service
- [ ] Atualizar componente de UI
- [ ] Testar no navegador
- [ ] Atualizar documentação

### Antes de Commit
- [ ] Código testado localmente
- [ ] Sem erros no console
- [ ] Build funciona (`npm run build`)
- [ ] Documentação atualizada

---

## 🔍 Debugging Tips

### Console do Navegador
```javascript
// Ver estado atual dos perfis
console.log(profiles);

// Ver configuração Supabase
console.log(supabase);

// Testar análise de nicho
analyzeProfileNiche('Nome', 'Bio aqui').then(console.log);
```

### Verificar Variáveis de Ambiente
```typescript
console.log('Gemini Key:', import.meta.env.VITE_GEMINI_API_KEY);
console.log('Apify Token:', import.meta.env.VITE_APIFY_API_TOKEN);
```

### Logs do Supabase
```typescript
// Em supabaseService.ts
console.log('Salvando:', dataToSave);
console.log('Erro:', error);
```

---

## 📦 Dependências (package.json)

### Produção
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "lucide-react": "^0.562.0",
  "@google/genai": "^1.34.0",
  "@supabase/supabase-js": "^2.39.7"
}
```

### Desenvolvimento
```json
{
  "@vitejs/plugin-react": "^5.0.0",
  "@types/node": "^22.14.0",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

---

## 🚀 Próximos Passos (Prioridade)

1. **Corrigir Gemini Service** (2h)
2. **Implementar Apify Real** (4h)
3. **Mover Credenciais para .env** (30min)
4. **Testar com Lista Real** (2h)
5. **Melhorar UX** (3h)

---

## 📚 Links Úteis

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vitejs.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Apify Docs](https://docs.apify.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 💡 Dicas de Produtividade

### Atalhos VS Code
- `Ctrl + P` - Buscar arquivo
- `Ctrl + Shift + F` - Buscar em todos os arquivos
- `F12` - Ir para definição
- `Alt + Shift + F` - Formatar código

### Git (Se aplicável)
```bash
git status                    # Ver mudanças
git add .                     # Adicionar tudo
git commit -m "mensagem"      # Commit
git push                      # Push para remote
```

---

**Última Atualização:** 08/01/2026  
**Mantido por:** Pedro Leon (O Mago)
