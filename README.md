<div align="center">

# 📊 InstaAnalyzer Pro

### Análise Inteligente de Leads do Instagram com IA

[![React](https://img.shields.io/badge/React-19.2.3-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ecf8e?logo=supabase)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)](https://www.docker.com/)

**Transforme listas de perfis do Instagram em insights acionáveis usando scraping automatizado, análise de nicho via IA e relatórios profissionais em PDF.**

[Demo](#-screenshots) • [Documentação](#-documentação) • [Instalação](#-instalação)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🚀 **Automação Completa**
- 📤 Upload de CSV com lista de perfis
- 🤖 Scraping via Apify (Instagram Profile Scraper)
- ☁️ Sincronização automática com Supabase
- 📊 Dashboard em tempo real

</td>
<td width="50%">

### 🧠 **Inteligência Artificial**
- 🎯 Classificação de nicho com Google Gemini
- 📈 Análise de métricas e engajamento
- ✅ Identificação de perfis verificados
- 🔥 Detecção de atividade recente

</td>
</tr>
</table>

### 📥 **Exportação Profissional**
- **PDF** - Relatórios completos com métricas, tabelas estilizadas e encoding UTF-8
- **CSV** - Compatível com Excel/Google Sheets
- **JSON** - Integração com outras ferramentas
- **Markdown** - Documentação e compartilhamento

---

## 🎯 Screenshots

<div align="center">

### Dashboard Principal
![Dashboard](https://github.com/user-attachments/assets/dashboard-preview)
*Análise em tempo real com métricas de leads, sincronização cloud e insights de IA*

### Relatório PDF Gerado
![PDF Report](https://github.com/user-attachments/assets/pdf-report-preview)
*Exportação profissional com formatação limpa e dados estruturados*

</div>

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 19 • TypeScript • Vite 6 • Tailwind CSS |
| **UI/UX** | Lucide Icons • Componentes customizados |
| **IA & Análise** | Google Gemini API (gemini-2.0-flash-exp) |
| **Scraping** | Apify Instagram Profile Scraper |
| **Backend** | Supabase (PostgreSQL + Realtime) |
| **Export** | jsPDF • jsPDF-AutoTable |
| **DevOps** | Docker • Docker Compose |

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- Docker (opcional, para produção)
- Conta Supabase ([criar grátis](https://supabase.com))
- API Key do Google Gemini ([obter aqui](https://aistudio.google.com/apikey))

### Setup Local

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd ANALISTA-DE-INSTAGRAM

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Execute em modo desenvolvimento
npm run dev
```

### Setup com Docker

```bash
# Build da imagem
docker build -t instaanalyzer-pro .

# Execute o container
docker run -p 5173:5173 \
  -e VITE_GEMINI_API_KEY=sua_chave \
  -e VITE_APIFY_API_TOKEN=seu_token \
  instaanalyzer-pro
```

---

## ⚙️ Configuração

### 1. Banco de Dados Supabase

Crie a tabela `insta_leads` no seu projeto Supabase:

```sql
CREATE TABLE insta_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  username TEXT,
  full_name TEXT,
  biography TEXT,
  followers_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  niche TEXT,
  has_posted_recently BOOLEAN DEFAULT false,
  last_post_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para performance
CREATE INDEX idx_username ON insta_leads(username);
CREATE INDEX idx_niche ON insta_leads(niche);
```

### 2. Variáveis de Ambiente

Edite o arquivo `.env.local`:

```env
# Google Gemini AI (Obrigatório para análise de nicho)
VITE_GEMINI_API_KEY=AIza...

# Apify Scraper (Obrigatório para scraping real)
VITE_APIFY_API_TOKEN=apify_api_...

# Supabase (As credenciais já estão no código por padrão)
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_KEY=eyJh...
```

---

## 📖 Como Usar

### 1. **Modo Demo** (Scraping Simulado)
```
1. Clique em "Upload CSV"
2. Selecione um arquivo com URLs do Instagram
3. Aguarde a análise simulada
4. Dados serão salvos automaticamente no Supabase
```

### 2. **Modo Produção** (Scraping Real)
```
1. Clique em "Config" no header
2. Insira seu token Apify
3. Upload do CSV
4. O sistema:
   ✓ Envia URLs para Apify
   ✓ Coleta dados reais dos perfis
   ✓ Analisa nicho com IA
   ✓ Sincroniza com banco de dados
```

### 3. **Exportar Relatório**
```
1. Use o dropdown "Exportar"
2. Escolha o formato (PDF, CSV, JSON, MD)
3. Arquivo será baixado automaticamente
```

---

## 📂 Estrutura do Projeto

```
ANALISTA-DE-INSTAGRAM/
├── components/
│   ├── ProfileTable.tsx    # Tabela de leads com filtros
│   └── StatsCards.tsx       # Cards de métricas
├── services/
│   ├── apifyService.ts      # Integração Apify
│   ├── geminiService.ts     # Análise de nicho IA
│   └── supabaseService.ts   # Persistência de dados
├── utils/
│   ├── pdfGenerator.ts      # Geração de PDF
│   └── translations.ts      # i18n de nichos
├── App.tsx                  # App principal
├── types.ts                 # Tipos TypeScript
├── Dockerfile               # Build para produção
└── README.md                # Você está aqui
```

---

## 🎨 Features Técnicas

### Análise de Nicho com IA
```typescript
// Classificação automática usando Gemini
Entrada: "@usuario" + "Bio do perfil"
Saída: "MARKETING" | "VENDAS" | "FINANÇAS" | ...
```

### Exportação PDF Avançada
- ✅ Encoding UTF-8 correto (sem caracteres estranhos)
- ✅ Layout profissional A4 landscape
- ✅ Tabelas estilizadas com cores alternadas
- ✅ Métricas em destaque
- ✅ Links clicáveis

### Scraping Inteligente
- Batch processing (10 perfis por vez)
- Retry automático em caso de falha
- Rate limiting respeitado
- Logs detalhados no console

---

## 🐛 Troubleshooting

<details>
<summary><b>Erro: "Failed to resolve import jspdf-autotable"</b></summary>

```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```
</details>

<details>
<summary><b>PDF com caracteres estranhos (Ø=Ý, Ø<ß¯)</b></summary>

A função `cleanText()` em `utils/pdfGenerator.ts` já remove emojis não suportados. Se persistir, verifique se está usando a versão mais recente do código.
</details>

<details>
<summary><b>Dados não aparecem no Dashboard</b></summary>

1. Abra o DevTools (F12)
2. Vá em Console
3. Procure por erros de rede
4. Verifique se o Supabase está configurado corretamente
</details>

---

## 📊 Roadmap

- [x] Upload e parsing de CSV
- [x] Scraping via Apify
- [x] Análise de nicho com IA
- [x] Sincronização Supabase
- [x] Dashboard interativo
- [x] Exportação PDF/CSV/JSON/MD
- [ ] Multi-tenant (suporte a múltiplas contas)
- [ ] Dashboard analytics avançado
- [ ] Agendamento de scraping
- [ ] Integração com CRM

---

## 📄 Licença

Este projeto é de uso proprietário.

---

## 👨‍💻 Desenvolvedor

<div align="center">

**Pedro Leon - O Mago** 🧙‍♂️

*Full Stack Developer & AI Specialist*

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?logo=github)](https://github.com/pedro-leon)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0a66c2?logo=linkedin)](https://linkedin.com/in/pedro-leon)

**Construído com ❤️ e TypeScript**

*Última atualização: Janeiro 2026*

</div>
