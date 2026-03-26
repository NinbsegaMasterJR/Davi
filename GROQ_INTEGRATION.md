# 🚀 Integrar Groq (Google Gemini) no Projeto

## PASSO 1: Obter a Chave Groq

1. Acesse: **https://console.groq.com/**
2. Clique em **"Sign Up"** (use Google ou GitHub - mais fácil)
3. Confirme seu email
4. Vá para **"API Keys"** (menu esquerdo)
5. Clique em **"Create API Key"**
6. Copie a chave (começa com `gsk_...`)
7. **Salve em segurança!**

---

## PASSO 2: Modificar Backend para Usar Groq

### 2.1 Instalar Biblioteca Groq

```bash
cd backend
npm install groq-sdk
```

### 2.2 Atualizar `backend/src/services/ia.service.ts`

```typescript
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Função para gerar esboço
export async function gerarEsbocoPregacao(
  tema: string,
  estilo: string,
  duracao: string,
): Promise<string> {
  const prompt = `Crie um esboço de pregação sobre o tema "${tema}" no estilo "${estilo}" com duração de ${duracao} minutos. 

Estrutura:
1. **Título**: um título impactante
2. **Versículo Base**: um versículo bíblico relevante
3. **Introdução**: 2-3 frases para engajar a audiência
4. **Desenvolvimento**:
   - Ponto 1 com explicação
   - Ponto 2 com explicação
   - Ponto 3 com explicação
5. **Conclusão**: resumo e chamada à ação
6. **Versículos de Apoio**: 3-5 versículos relacionados

Formato: markdown`;

  const message = await groq.messages.create({
    model: "mixtral-8x7b-32768", // Modelo rápido do Groq
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

// Função para análise teológica
export async function analisarTeologicamente(
  tema: string,
  passagem?: string,
  profundidade: string = "media",
): Promise<string> {
  const prompt = `Faça uma análise teológica ${profundidade} do tema "${tema}"${
    passagem ? ` baseada na passagem: ${passagem}` : ""
  }

Incluir:
1. **Contexto Histórico**: origem e contexto bíblico
2. **Conceito Teológico**: significado e importância
3. **Perspectivas**: diferentes interpretações
4. **Aplicação Prática**: como usar na vida moderna
5. **Conclusão**: síntese e reflexão

Formato: markdown`;

  const message = await groq.messages.create({
    model: "mixtral-8x7b-32768",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

// Função para explicar passagem
export async function explicarPassagem(
  tema: string,
  passagem: string,
): Promise<string> {
  const prompt = `Explique a seguinte passagem bíblica sobre "${tema}":

"${passagem}"

Incluir:
1. **Contexto**: quando e por que foi escrito
2. **Significado Original**: o que significava na época
3. **Interpretação**: o que significa hoje
4. **Aplicação Prática**: como aplicar na vida
5. **Reflexão Pessoal**: uma reflexão profunda

Formato: markdown`;

  const message = await groq.messages.create({
    model: "mixtral-8x7b-32768",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
```

---

## PASSO 3: Atualizar `backend/.env`

```
GROQ_API_KEY=gsk_sua_chave_aqui
NODE_ENV=production
PORT=3001
```

---

## PASSO 4: Fazer Push e Deploy

```powershell
cd "c:\Users\prdav\OneDrive\Trabalhos-Davi\Gerador.P-Web"

# Adicionar mudanças
git add backend/src/services/ia.service.ts backend/.env backend/package.json

# Commit
git commit -m "Integrar Groq API para processamento de IA"

# Push
git push origin main
```

---

## PASSO 5: Configurar Railway

1. Vá para seu projeto no Railway: https://railway.app/dashboard
2. Clique no serviço **"backend"**
3. Vá para aba **"Variables"**
4. Adicione:
   ```
   GROQ_API_KEY=gsk_sua_chave_aqui
   ```
5. Railway faz redeploy automaticamente ✅

---

## 🎯 Pronto!

Seu site vai agora usar **Groq** que é:

- ⚡ **Super rápido** (responde em 1-2 segundos)
- ✅ **Completamente grátis**
- 🚀 **Sem limites** (para uso normal)
- 🤖 **Modelos excelentes** (Mixtral, LLaMA)

**Teste em produção:**

- Acesse seu site no Railway
- Clique em "Gerar Esboço"
- Deve funcionar instantaneamente!

---

**Cole a chave aqui quando tiver:** `gsk_...`
