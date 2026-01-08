# 📝 Biografia do Instagram - Implementação Real

**Data:** 08/01/2026 às 15:22  
**Objetivo:** Trazer biografia EXATAMENTE como está no Instagram (com links, emojis e formatação)

---

## ✅ Alterações Aplicadas (Modo Demo)

### 1. **Biografias Realistas** (`services/apifyService.ts`)

**Antes:**
```typescript
const bio = `🚀 Especialista em Crescimento Digital | +10k alunos`;
```

**Depois:**
```typescript
const realisticBios = [
  "🚀 Especialista em Alta Performance | Transformando negócios\n📈 +10k alunos\n📩 contato@exemplo.com\n👇 Acesse meu curso",
  "💡 Consultoria em Crescimento Digital | +10k alunos\n🎯 Resultados reais em 90 dias\n📲 WhatsApp: (11) 99999-9999\n🔗 linktr.ee/exemplo",
  // ... 12 biografias realistas
];
```

**Características:**
- ✅ Emojis preservados
- ✅ Quebras de linha (`\n`)
- ✅ Links e contatos
- ✅ Formatação multi-linha

---

### 2. **Exibição com Formatação** (`components/ProfileTable.tsx`)

**Antes:**
```tsx
<span className="line-clamp-2 italic">
  {profile.biography}
</span>
```

**Depois:**
```tsx
<span 
  className="whitespace-pre-line line-clamp-4"
  style={{ wordBreak: 'break-word' }}
>
  {profile.biography}
</span>
```

**Melhorias:**
- ✅ `whitespace-pre-line` - Preserva quebras de linha
- ✅ `line-clamp-4` - Mostra até 4 linhas
- ✅ `word-break: break-word` - Quebra URLs longas
- ✅ `max-w-md` - Largura máxima controlada

---

## 🔧 Implementação Real com Apify

Quando implementarmos o scraping real, o Apify retornará a biografia assim:

### Resposta do Apify Instagram Scraper
```json
{
  "username": "exemplo_usuario",
  "fullName": "Nome Completo",
  "biography": "🚀 Especialista em Marketing\n📈 +10k alunos\n📩 contato@exemplo.com\n🔗 linktr.ee/exemplo",
  "externalUrl": "https://linktr.ee/exemplo",
  "followersCount": 50000,
  "verified": true
}
```

### Código para Apify Real
```typescript
export const runInstagramScraper = async (
  urls: string[], 
  apifyToken: string,
  onProgress: (profiles: InstagramProfile[]) => void
) => {
  if (!apifyToken || apifyToken === 'DEMO') {
    return simulateScraping(urls, onProgress);
  }

  // ✅ Implementação real do Apify
  const ApifyClient = require('apify-client');
  const client = new ApifyClient({ token: apifyToken });

  const input = {
    directUrls: urls,
    resultsType: 'profiles',
    resultsLimit: urls.length,
    searchType: 'user',
    searchLimit: 1
  };

  const run = await client.actor('apify/instagram-scraper').call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  const profiles: InstagramProfile[] = items.map((item: any, index: number) => ({
    id: item.id || Math.random().toString(36).substr(2, 9),
    url: item.url || urls[index],
    username: item.username || '',
    fullName: item.fullName || item.username || '',
    biography: item.biography || '', // ✅ Bio original do Instagram
    followersCount: item.followersCount || 0,
    isVerified: item.verified || false,
    niche: 'Não Categorizado', // Será classificado depois
    hasPostedRecently: checkRecentPost(item.latestPosts),
    lastPostDate: getLastPostDate(item.latestPosts),
    profilePicUrl: item.profilePicUrl,
    status: 'completed'
  }));

  onProgress(profiles);
  return profiles;
};
```

---

## 📊 Exemplos de Biografias Reais

### Exemplo 1: Influencer de Fitness
```
🏋️ Personal Trainer | Transformação física
💪 +500 alunos transformados
📱 App: FitCoach
📩 DM para consultoria
🔗 linktr.ee/fitcoach
```

### Exemplo 2: Advogado
```
💼 Advogado | Direito Empresarial
⚖️ OAB/SP 123.456
📍 São Paulo - SP
📞 (11) 3333-4444
📧 contato@escritorio.com.br
```

### Exemplo 3: Coach de Negócios
```
🚀 Especialista em Alta Performance
📈 +10k alunos
💰 7 dígitos faturados
📚 Autor de 3 livros
🎓 Cursos: meusite.com.br
👇 Link na bio
```

---

## 🎨 CSS para Exibição

### Preservar Quebras de Linha
```css
.whitespace-pre-line {
  white-space: pre-line; /* Preserva \n mas colapsa espaços */
}
```

### Quebrar URLs Longas
```css
.word-break-all {
  word-break: break-all; /* Quebra URLs longas */
}
```

### Limitar Linhas
```css
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 🔍 Campos do Instagram que Devem Ser Preservados

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **biography** | Texto completo da bio | "🚀 Especialista...\n📈 +10k alunos" |
| **externalUrl** | Link externo (se houver) | "https://linktr.ee/exemplo" |
| **email** | Email (se público) | "contato@exemplo.com" |
| **phoneNumber** | Telefone (se público) | "(11) 99999-9999" |

---

## ⚠️ Importante: NÃO Processar a Bio

### ❌ Não Fazer:
```typescript
// NÃO remover emojis
biography = biography.replace(/[\u{1F600}-\u{1F64F}]/gu, '');

// NÃO remover quebras de linha
biography = biography.replace(/\n/g, ' ');

// NÃO limitar caracteres arbitrariamente
biography = biography.substring(0, 100);

// NÃO usar IA para reescrever
biography = await gemini.rewrite(biography);
```

### ✅ Fazer:
```typescript
// ✅ Usar exatamente como vem do Apify
biography: item.biography || '',

// ✅ Apenas sanitizar HTML (se necessário)
biography: sanitizeHtml(item.biography, { allowedTags: [] }),

// ✅ Preservar formatação original
biography: item.biography?.trim() || '',
```

---

## 🧪 Teste de Exibição

### HTML Gerado
```html
<span 
  class="whitespace-pre-line line-clamp-4"
  style="word-break: break-word;"
>
  🚀 Especialista em Alta Performance | Transformando negócios
  📈 +10k alunos
  📩 contato@exemplo.com
  👇 Acesse meu curso
</span>
```

### Renderização
```
🚀 Especialista em Alta Performance | Transformando negócios
📈 +10k alunos
📩 contato@exemplo.com
👇 Acesse meu curso
```

---

## 📝 Checklist de Implementação

### Modo Demo (Atual)
- [x] Biografias realistas com quebras de linha
- [x] Emojis preservados
- [x] Links e contatos incluídos
- [x] Exibição com `whitespace-pre-line`
- [x] Limite de 4 linhas visíveis

### Modo Produção (Apify Real)
- [ ] Integrar com Apify Instagram Scraper
- [ ] Mapear campo `biography` sem modificações
- [ ] Mapear campo `externalUrl` se disponível
- [ ] Testar com perfis reais
- [ ] Validar preservação de formatação

---

## 🎯 Resultado Esperado

### Tabela de Perfis
```
┌──────────────┬────────────┬────────────────────────────────────────┐
│ PERFIL       │ NICHO      │ BIOGRAFIA DO INSTAGRAM                 │
├──────────────┼────────────┼────────────────────────────────────────┤
│ @exemplo     │ Marketing  │ 🚀 Especialista em Alta Performance    │
│              │ Digital    │ 📈 +10k alunos                         │
│              │            │ 📩 contato@exemplo.com                 │
│              │            │ 👇 Acesse meu curso                    │
└──────────────┴────────────┴────────────────────────────────────────┘
```

---

## 💡 Dicas Adicionais

### Detectar Links na Bio
```typescript
const extractLinks = (bio: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return bio.match(urlRegex) || [];
};

// Uso
const links = extractLinks(profile.biography);
// ['https://linktr.ee/exemplo', 'https://meusite.com.br']
```

### Detectar Emails
```typescript
const extractEmails = (bio: string): string[] => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
  return bio.match(emailRegex) || [];
};
```

### Detectar Telefones
```typescript
const extractPhones = (bio: string): string[] => {
  const phoneRegex = /(\(\d{2}\)\s?\d{4,5}-?\d{4})/g;
  return bio.match(phoneRegex) || [];
};
```

---

**Status:** ✅ **Biografias realistas implementadas no modo demo!**  
**Próximo passo:** Implementar Apify real para trazer biografias originais do Instagram.
