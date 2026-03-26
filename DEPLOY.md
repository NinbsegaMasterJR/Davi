# Deploy Guide - Pregador IA

Este projeto está padronizado para deploy no Railway.

- Package manager: npm 11.9.0
- Frontend: Railway com Root Directory `frontend`
- Backend: Railway com Root Directory `backend`
- IA: Groq via `GROQ_API_KEY`

## Guia canônico

Use [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md) como referência principal.

## Resumo rápido

### Frontend

```txt
Service Name: frontend
Runtime: Node.js
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npx vite preview --host 0.0.0.0 --port $PORT
Environment Variable: VITE_API_URL=https://seu-backend.up.railway.app
```

### Backend

```txt
Service Name: backend
Runtime: Node.js
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
Environment Variables:
GROQ_API_KEY=gsk_sua_chave
CORS_ORIGIN=https://seu-frontend.up.railway.app
NODE_ENV=production
```

## Validação

1. Abra `https://seu-backend.up.railway.app/health`
2. Abra o frontend publicado
3. Gere um esboço e teste concordância, análise e explicação de passagem

## Resposta esperada do health check

```json
{ "status": "OK", "message": "Pregador IA API is running" }
```
