# Deploy Guide - Pregador IA

## ☁️ Opção 1: Deploy GRATUITO (Recomendado)

### Frontend (Vercel)

1. Acesse https://vercel.com
2. Faça login com GitHub/Google
3. Clique em "Add New..." → "Project"
4. Selecione o repo `Gerador.P-Web`
5. Framework Preset: **Vite**
6. Clique em "Deploy"

**URL:** https://seu-projeto.vercel.app

---

### Backend (Render)

1. Acesse https://render.com
2. Clique em "New" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** pregador-ia-api
   - **Runtime:** Node.js
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Adicione variáveis de ambiente:
   ```
   ANTHROPIC_API_KEY=sua_chave_aqui
   CORS_ORIGIN=https://seu-projeto.vercel.app
   NODE_ENV=production
   ```
6. Clique em "Create Web Service"

**URL:** https://pregador-ia-api.onrender.com

---

## 🚀 Passo a Passo Completo

### 1. Preparar Repositório GitHub

```bash
# Na raiz do Gerador.P-Web
git init
git add .
git commit -m "Initial commit: Pregador IA Web"
git branch -M main
git remote add origin https://github.com/seu-usuario/Gerador.P-Web.git
git push -u origin main
```

### 2. Deploy Frontend (Vercel)

```
Frontend URL: https://seu-projeto.vercel.app
```

**Environment Variables (Vercel):**

```
VITE_API_URL=https://pregador-ia-api.onrender.com
```

### 3. Deploy Backend (Render)

```
Backend URL: https://pregador-ia-api.onrender.com
```

**Environment Variables (Render):**

```
ANTHROPIC_API_KEY=sk-ant-...
CORS_ORIGIN=https://seu-projeto.vercel.app
DATABASE_URL=(opcional)
NODE_ENV=production
```

### 4. Atualizar URLs no Frontend

Edite `.env.production`:

```env
VITE_API_URL=https://pregador-ia-api.onrender.com
```

---

## 📋 Checklist de Deploy

- [ ] GitHub account criada
- [ ] Repositório enviado para GitHub
- [ ] Vercel conectado e Frontend deployado
- [ ] Render conectado e Backend deployado
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Teste API em: `https://pregador-ia-api.onrender.com/health`
- [ ] Frontend funcionando em produção

---

## 🔑 Obter Chave Anthropic

1. Acesse https://console.anthropic.com
2. Clique em "Get API Key"
3. Copie a chave
4. Adicione nas variáveis de ambiente do Render

---

## ⚡ Alternativas de Hosting

### Backend

| Serviço    | Grátis            | Deploy     | URL           |
| ---------- | ----------------- | ---------- | ------------- |
| **Render** | ✅ Sim            | Automático | onrender.com  |
| Railway    | ✅ $5/mês crédito | Automático | railway.app   |
| Heroku     | ❌ Não            | Automático | herokuapp.com |
| Fly.io     | ✅ Sim            | -          | fly.io        |

### Frontend

| Serviço      | Grátis | Deploy     | URL         |
| ------------ | ------ | ---------- | ----------- |
| **Vercel**   | ✅ Sim | Automático | vercel.app  |
| Netlify      | ✅ Sim | Automático | netlify.app |
| GitHub Pages | ✅ Sim | Manual     | github.io   |

---

## 🧪 Testar em Produção

```bash
# Verificar saúde do Backend
curl https://pregador-ia-api.onrender.com/health

# Resposta esperada:
# {"status":"OK","message":"Pregador IA API is running"}
```

---

## 📞 Suporte

Documentação oficial:

- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Anthropic: https://docs.anthropic.com

---

**Seu site estará no ar em ~15 minutos!** 🎉
