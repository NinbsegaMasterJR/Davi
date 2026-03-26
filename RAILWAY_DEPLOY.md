# 🚀 Deploy no Railway.app - Guia Completo

Projeto padronizado com `npm@11.9.0`. Use npm nos comandos e nas configurações de build.

## Por que Railway? 🎯

- ✅ Simples e intuitivo
- ✅ Conecta direto ao GitHub
- ✅ Deploy automático (push = deploy)
- ✅ Tier grátis generoso ($5/mês)
- ✅ Suporta banco de dados, múltiplos serviços
- ✅ 0 configuração complicada

---

## PASSO 1: Criar Conta no Railway

1. Vá para: **https://railway.app/**
2. Clique em **"Start Free"**
3. Escolha **"Login with GitHub"** (mais fácil)
4. Autorize a conexão
5. Pronto! ✅

---

## PASSO 2: Deploy do Frontend (React)

### 2.1 Criar Novo Projeto

1. No dashboard Railway, clique em **"New Project"**
2. Escolha **"Deploy from GitHub"**
3. Busque e selecione o repositório do projeto
4. Clique em **"Deploy"**

### 2.1.1 Definir Root Directory

Para cada serviço em monorepo, configure o diretório raiz corretamente:

- Frontend: `frontend`
- Backend: `backend`

### 2.2 Configurar Frontend

Railway vai detectar automaticamente, mas confirme:

**Config do Serviço Frontend:**

```
Service Name: frontend
Runtime: Node.js
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npx vite preview --host 0.0.0.0 --port $PORT
Port: variável $PORT do Railway
```

⚠️ **Se não detectar automático:**

1. Clique em "Add New Service"
2. Escolha "GitHub Repository"
3. Selecione seu repo
4. Configure como acima

### 2.3 Variáveis de Ambiente (Frontend)

Clique na aba "Variables" e adicione:

```
VITE_API_URL=https://seu-backend-railway.up.railway.app
```

✅ **Deploy automático começa agora!** Aguarde 3-5 minutos.

---

## PASSO 3: Deploy do Backend (Node.js/Express)

### 3.1 Adicionar Novo Serviço

1. Volte ao seu projeto Railway
2. Clique em **"+ New Service"**
3. Escolha **"GitHub Repository"**
4. Selecione o mesmo repositório

### 3.2 Configurar Backend

**Config do Serviço Backend:**

```
Service Name: backend
Runtime: Node.js
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
Port: variável $PORT do Railway
```

### 3.3 Variáveis de Ambiente (CRÍTICO!)

Clique na aba "Variables" e adicione:

```
GROQ_API_KEY=gsk_sua_chave_aqui
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.up.railway.app
```

⚠️ **Substitua `gsk_sua_chave_aqui` pela sua chave real e informe a URL real do frontend em `CORS_ORIGIN`.**

✅ **Deploy automático começa!** Aguarde 3-5 minutos.

---

## PASSO 4: Conectar Banco de Dados (Opcional para Depois)

Railway oferece **PostgreSQL grátis**! Para adicionar depois:

1. Clique em **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway cria uma variável `DATABASE_URL` automaticamente
3. Seu backend acessa via `process.env.DATABASE_URL`

---

## PASSO 5: Obter URLs de Produção

### Seu Frontend está em:

```
https://seu-projeto-railway.up.railway.app
```

### Seu Backend está em:

```
https://seu-backend-railway.up.railway.app
```

**Para encontrar as URLs exatas:**

1. Clique no serviço (frontend ou backend)
2. Vá para "Settings"
3. Procure por "Domains" ou "Public URL"
4. Terá algo tipo: `https://seu-nome.up.railway.app`

---

## PASSO 6: Testar o Site

### Teste Frontend

1. Acesse a URL do frontend (salvo acima)
2. Clique em "Início"
3. Tente gerar um esboço
4. Se funcionar = **SIM!** 🎉

### Se Não Funcionar

**Problema**: Backend não conecta

**Solução 1**: Verificar GROQ_API_KEY

- Vá no painel do backend no Railway
- Clique em "Variables"
- Verifique se a chave está correta
- Se não, edite e salve
- Railway redeploy automaticamente

**Solução 2**: Verificar URL do Backend

- Frontend precisa saber URL do backend
- Arquivo: `/frontend/src/config.ts`
- Deve ter a URL correta do backend
- Se mudar, faça:
  ```powershell
  git add frontend/src/config.ts
  git commit -m "Update backend URL for production"
  git push origin main
  ```
- Railway redeploy automaticamente

---

## PASSO 7: Acompanhar Logs

**Se algo der errado:**

1. Vá no Dashboard Railway
2. Clique no serviço (frontend ou backend)
3. Aba **"Logs"** mostra o que aconteceu
4. Procure por erros em vermelho

---

## 🎯 Resumo das URLs

| Serviço               | Link                               |
| --------------------- | ---------------------------------- |
| **GitHub**            | seu repositório no GitHub          |
| **Frontend**          | https://seu-projeto.up.railway.app |
| **Backend**           | https://seu-backend.up.railway.app |
| **Railway Dashboard** | https://railway.app/dashboard      |

---

## 🚀 Depois que Funcionar

### Deploy Automático

Cada vez que você der `git push`:

1. GitHub recebe o código
2. Railway detecta mudança
3. Faz rebuild automático
4. Site atualiza em 2-3 minutos

### Monitorar

- **Histórico de deploy**: "Deployments" aba
- **Logs em tempo real**: "Logs" aba
- **Uso de recursos**: "Metrics" aba

---

## 💡 Dicas Importantes

1. **Variáveis de Ambiente**
   - Nunca coloque chaves no código
   - Use Railway "Variables"
   - Mais seguro assim

2. **Build Local vs Production**
   - Teste local com `npm run dev`
   - Deploy com `npm run build`
   - São diferentes!

3. **se vir "Service Failed"**
   - Vá nos Logs
   - Procure por erro em vermelho
   - Geralmente é `GROQ_API_KEY` faltando ou `CORS_ORIGIN` incorreto

---

## ✅ Checklist Final

- [ ] Criei conta no Railway.app via GitHub
- [ ] Deploiou Frontend
- [ ] Configurei GROQ_API_KEY no Backend
- [ ] Configurei CORS_ORIGIN no Backend
- [ ] Configurei VITE_API_URL no Frontend
- [ ] Deploiou Backend
- [ ] Testei Frontend em produção
- [ ] Cliquei em um recurso (esboço/versículos/análise)
- [ ] Funcionou! 🎉

---

**Dúvidas? Estou aqui!** 🚀
