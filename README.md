<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# InstaAnalyzer Pro 🚀

> **Ferramenta SaaS de Análise e Qualificação de Leads do Instagram**

Uma aplicação React moderna que automatiza a coleta, análise e qualificação de perfis do Instagram usando IA e sincronização em nuvem.

[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Active-green)](https://supabase.com/)

---

## ✨ Features

- 📤 **Upload de CSV** - Importe listas de perfis do Instagram
- 🤖 **Scraping Automatizado** - Coleta dados públicos via Apify (modo demo ativo)
- 🧠 **Análise de Nicho via IA** - Classificação inteligente usando Gemini AI
- ☁️ **Sincronização Cloud** - Dados salvos automaticamente no Supabase
- 📊 **Dashboard Interativo** - Visualize métricas e filtre resultados
- 📥 **Exportação Multi-formato** - CSV, JSON e Markdown

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 ou superior)
- **Conta Supabase** (para persistência de dados)
- **API Key do Gemini** (opcional, para análise de nicho)

### Instalação

1. **Clone o repositório** (ou navegue até o diretório)
   ```bash
   cd "d:\01_PROJETOS\01.PEDRO LEON - O MAGO\SAAS\ANALISTA-DE-INSTAGRAM"
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie/edite o arquivo `.env.local`:
   ```env
   VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
   VITE_APIFY_API_TOKEN=seu_token_apify_aqui
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   
   Abra [http://localhost:5173](http://localhost:5173) no navegador

---

## 📂 Estrutura do Projeto

```
ANALISTA-DE-INSTAGRAM/
├── components/          # Componentes React
│   ├── ProfileTable.tsx
│   └── StatsCards.tsx
├── services/            # Integrações externas
│   ├── apifyService.ts
│   ├── geminiService.ts
│   └── supabaseService.ts
├── App.tsx              # Componente principal
├── types.ts             # Definições TypeScript
├── DOCUMENTATION.md     # 📚 Documentação técnica completa
├── PLANNING.md          # Roadmap do projeto
└── GEMINI.md            # Contexto para IA
```

---

## 📖 Documentação

Para informações técnicas detalhadas, consulte:

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Arquitetura, fluxo de dados, componentes e troubleshooting
- **[PLANNING.md](./PLANNING.md)** - Roadmap e planejamento de features
- **[GEMINI.md](./GEMINI.md)** - Contexto do projeto para IA

---

## 🎯 Como Usar

1. **Modo Demo (Padrão)**
   - Clique em "Upload CSV" e selecione um arquivo com URLs do Instagram
   - O sistema irá simular o scraping e gerar dados fictícios
   - Os dados são salvos automaticamente no Supabase

2. **Modo Produção**
   - Clique em "Config" no header
   - Insira seu token do Apify
   - Faça upload do CSV para scraping real

3. **Carregar Dados Salvos**
   - Clique em "Carregar do Banco" para sincronizar com o Supabase

4. **Exportar Resultados**
   - Use o botão "Exportar" para baixar em CSV, JSON ou Markdown

---

## ⚙️ Configuração Avançada

### Banco de Dados Supabase

A tabela `insta_leads` deve ter o seguinte schema:

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

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `VITE_GEMINI_API_KEY` | Chave da API do Google Gemini | Não* |
| `VITE_APIFY_API_TOKEN` | Token da API do Apify | Não* |

*Não obrigatórias no modo demo

---

## 🐛 Troubleshooting

### Erro: "API key not valid"
- Verifique se a variável `VITE_GEMINI_API_KEY` está configurada em `.env.local`
- Reinicie o servidor de desenvolvimento após alterar `.env.local`

### Dados não aparecem após upload
- Confirme que o modo Demo está ativo (indicador laranja no header)
- Verifique o console do navegador para erros

### Erro ao salvar no Supabase
- Confirme que o schema da tabela está correto
- Verifique as credenciais em `services/supabaseService.ts`

Para mais detalhes, consulte a seção **Troubleshooting** em [DOCUMENTATION.md](./DOCUMENTATION.md).

---

## 🛠 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run preview  # Preview do build de produção
```

---

## 📊 Status do Projeto

- ✅ **Funcional**: Upload CSV, Dashboard, Exportação, Sincronização Cloud
- 🚧 **Em Desenvolvimento**: Integração real com Apify, Análise de nicho via IA
- 📋 **Planejado**: Autenticação, Analytics avançado, Multi-plataforma

---

## 🔗 Links Úteis

- [AI Studio App](https://ai.studio/apps/drive/1JTe_1sbiBCUr9dgcfbUdM1J08-SBFTnm)
- [Documentação do Apify](https://docs.apify.com/)
- [Documentação do Gemini](https://ai.google.dev/docs)
- [Documentação do Supabase](https://supabase.com/docs)

---

## 📄 Licença

Projeto proprietário - Uso interno

---

**Desenvolvido por Pedro Leon (O Mago)** | Última atualização: 08/01/2026
