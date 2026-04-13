# Deploy no Railway - Guia Completo

Projeto padronizado com `npm@11.9.0`.

## URLs Publicas Atuais

- Frontend: `https://pregador-ia.vercel.app`
- Backend: `https://pregador-ia-api.vercel.app`

## Observacao

Hoje a publicacao principal esta na Vercel. Se voce quiser publicar no Railway, use este guia e substitua as URLs pelas do seu novo ambiente.

## Frontend no Railway

```txt
Service Name: frontend
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npx vite preview --host 0.0.0.0 --port $PORT
VITE_API_URL=https://pregador-ia-api.vercel.app
```

## Backend no Railway

```txt
Service Name: backend
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
GROQ_API_KEY=gsk_sua_chave
NODE_ENV=production
CORS_ORIGIN=https://pregador-ia.vercel.app
```

## Validacao

1. Abra `https://pregador-ia-api.vercel.app/health`
2. Abra `https://pregador-ia.vercel.app`
3. Teste a geracao de conteudo

## Resumo de URLs

| Servico | Link |
| --- | --- |
| Frontend atual | https://pregador-ia.vercel.app |
| Backend atual | https://pregador-ia-api.vercel.app |
| Railway | https://railway.app/dashboard |
