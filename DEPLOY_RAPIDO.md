# 🚀 Colocar Pregador IA no Ar - Guia Rápido

## ⚡ TL;DR (Quick Start)

1. **Clicar aqui:** https://vercel.com/new
2. **Clicar aqui:** https://render.com/new
3. **Pronto!** Site está no ar em ~15 minutos

---

## 📋 Step-by-Step Completo

### PASSO 1️⃣: Preparar GitHub

```bash
cd Gerador.P-Web

# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Pregador IA - Versão Web"

# Criar main branch
git branch -M main

# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/Gerador.P-Web.git

# Enviar para GitHub
git push -u origin main
```

**GitHub:** Acesse https://github.com/new para criar um novo repositório

---

### PASSO 2️⃣: Deploy Frontend (Vercel)

1. Acesse **https://vercel.com**
2. Clique **"Sign Up"** → crie conta com GitHub
3. Clique **"Add New..."** → **"Project"**
4. Selecione **Gerador.P-Web**
5. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
6. Clique **"Deploy"** ✨

**Sua URL será:** `https://seu-projeto.vercel.app`

---

### PASSO 3️⃣: Deploy Backend (Render)

1. Acesse **https://render.com**
2. Clique **"Sign Up"** → crie conta com GitHub
3. Clique **"New"** → **"Web Service"**
4. Conecte seu repositório GitHub
5. Configure:
   ```
   Name: pregador-ia-api
   Runtime: Node.js
   Start Command: npm start
   ```
6. Clique **"Advanced"** e adicione:
   ```
   ANTHROPIC_API_KEY = sk-ant-...
   CORS_ORIGIN = https://seu-projeto.vercel.app
   NODE_ENV = production
   ```
7. Clique **"Create Web Service"** ✨

**Sua URL será:** `https://pregador-ia-api.onrender.com`

---

### PASSO 4️⃣: Conectar Frontend ↔ Backend

Edite no Vercel:

1. Dashboard → Projeto → **Settings**
2. **Environment Variables**
3. Adicione:
   ```
   VITE_API_URL = https://pregador-ia-api.onrender.com/api
   ```
4. **Redeploy** (automático)

---

## ✅ Checklist Final

- [ ] GitHub conta criada
- [ ] Repositório enviado (git push)
- [ ] Vercel account criada com GitHub
- [ ] Frontend deployado (https://seu-projeto.vercel.app)
- [ ] Render account criada com GitHub
- [ ] Backend deployado (https://pregador-ia-api.onrender.com)
- [ ] Variáveis de ambiente configuradas
- [ ] Teste: acesse seu site e tente usar um comando

---

## 🧪 Testar Produção

### 1. Health Check (Backend)

```bash
curl https://pregador-ia-api.onrender.com/health
```

Deve retornar:

```json
{ "status": "OK", "message": "Pregador IA API is running" }
```

### 2. Testar Frontend

Acesse seu URL: `https://seu-projeto.vercel.app`

Tente:

- Digite um tema em "Gerar Esboço"
- Clique em "Gerar Esboço"
- Aguarde resposta da IA

---

## 🔐 Chave Anthropic (Claude)

1. Acesse https://console.anthropic.com
2. Clique **"Get API Key"**
3. Copie a chave (começa com `sk-ant-`)
4. Cole em Render → **ANTHROPIC_API_KEY**

---

## 💰 Custo

| Serviço         | Custo                       | Status |
| --------------- | --------------------------- | ------ |
| Vercel Frontend | **GRÁTIS**                  | ✅     |
| Render Backend  | **GRÁTIS** (com limitações) | ✅     |
| Anthropic API   | Pague conforme usar         | 💳     |

**Primeiro mês:** Grátis! Depois depende de uso.

---

## 🆘 Erro Comum: "Cannot Cannot connect to API"

**Solução:**

1. Ir em Render → Web Service → **Logs**
2. Verificar se há erro
3. Confirmar CORS_ORIGIN está correto em Render
4. Redeploy em Vercel

---

## 📊 Status do Site

Com tudo "no ar", você tem:

- ✅ Frontend em Vercel (rápido, global)
- ✅ Backend em Render (serverless, automático)
- ✅ IA Claude (powered by Anthropic)
- ✅ HTTPS (seguro)
- ✅ Auto-scaling (crescimento automático)

---

## 📞 Suporte

- **Vercel:** https://vercel.com/support
- **Render:** https://render.com/docs
- **Anthropic:** https://support.anthropic.com

---

**Seu site estará no ar em ~15 minutos! 🎉**

Próximas melhorias opcionais:

- Domínio próprio (seu-dominio.com)
- Email (seu-email@seu-dominio.com)
- Analytics (Google Analytics)
- Banco de dados (PostgreSQL)
