# 🚀 Colocar Pregador IA no Ar - Guia Rápido

## ⚡ TL;DR

1. Envie o repositório para o GitHub
2. Crie dois serviços no Railway: `frontend` e `backend`
3. Configure `VITE_API_URL`, `GROQ_API_KEY` e `CORS_ORIGIN`
4. Aguarde o deploy e teste a rota `/health`

## Stack atual de deploy

- Package manager: npm 11.9.0
- Frontend: Railway com Root Directory `frontend`
- Backend: Railway com Root Directory `backend`
- IA: Groq

## Configuração rápida

### Serviço frontend

```txt
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npx vite preview --host 0.0.0.0 --port $PORT
VITE_API_URL=https://seu-backend.up.railway.app
```

### Serviço backend

```txt
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
GROQ_API_KEY=gsk_sua_chave
CORS_ORIGIN=https://seu-frontend.up.railway.app
NODE_ENV=production
```

## Checklist final

- [ ] Repositório enviado ao GitHub
- [ ] Frontend publicado no Railway
- [ ] Backend publicado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Teste em `/health` funcionando
- [ ] Geração de conteúdo funcionando no frontend

## Teste rápido

Verifique se o backend responde em:

```txt
https://seu-backend.up.railway.app/health
```

Resposta esperada:

```json
{ "status": "OK", "message": "Pregador IA API is running" }
```

## Guia completo

Se precisar do passo a passo completo, use [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md).
