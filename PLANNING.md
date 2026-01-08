# Projeto: Analista de Instagram (Scraper Automático)

Este projeto visa automatizar a coleta de dados de perfis do Instagram a partir de uma lista de links fornecida em CSV, utilizando a API do Apify e uma interface moderna construída com React + Shadcn UI.

## 🎯 Objetivos
- Upload de CSV com links de perfis.
- Scraping automatizado via Apify.
- Visualização em dashboard interativo.
- Exportação de dados em múltiplos formatos (TXT, PDF, MD).

## 🛠 Tech Stack
- **Frontend**: React (Vite) + TypeScript
- **Estilização**: Tailwind CSS + Shadcn UI
- **Processamento de Dados**: PapaParse (CSV) + Apify API Client
- **Exportação**: jsPDF (PDF) + FileSaver (TXT/MD)
- **Ícones**: Lucide React

## 📊 Campos Coletados
- Link do Perfil
- Nome Completo
- Biografia
- Nicho (Análise via Bio/Categoria)
- Seguidores
- Status de Verificado (Badge)
- Recência de Postagem (Últimos 30 dias)

## 📅 Roadmap de Implementação

### Fase 1: Setup & Estrutura (Dia 1 - Hora 1)
- [ ] Inicialização do projeto Vite.
- [ ] Configuração do Tailwind CSS e Shadcn UI.
- [ ] Estrutura de pastas (components, hooks, services, utils).

### Fase 2: Lógica de Dados (Dia 1 - Hora 2)
- [ ] Implementação de Parser de CSV.
- [ ] Integração com Apify API.
- [ ] Lógica para identificar "Nicho" e "Postou nos últimos 30 dias".

### Fase 3: Interface do Usuário (Dia 1 - Hora 3)
- [ ] Componente de Upload com Drag & Drop.
- [ ] Tabela de visualização com filtros e busca.
- [ ] Cards de Overview (Stats gerais).

### Fase 4: Exportação & Finalização (Dia 1 - Hora 4)
- [ ] Botões de download (TXT, PDF, MD).
- [ ] Refinamento visual (Animações, Modo Escuro).
- [ ] Testes de robustez com a lista de 135 links.

---

## 🚀 Como Usar
1. Clonar o repositório.
2. `npm install`
3. Configurar API Key do Apify no `.env`.
4. `npm run dev`
5. Arrastar o arquivo `Viral Nicolas (JAN-26) - Leads - Página2.csv` para a área de upload.
