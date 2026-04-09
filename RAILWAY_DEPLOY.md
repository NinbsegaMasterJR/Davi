# Deploy no Railway - Guia Completo

Projeto padronizado com `npm@11.9.0`.

## URLs Publicas Atuais

- Frontend: `https://scriptura-web.vercel.app`
- Backend: `https://scriptura-web-api.vercel.app`

## Observacao

Hoje a publicacao principal esta na Vercel. Se voce quiser publicar no Railway, use este guia e substitua as URLs pelas do seu novo ambiente.

## Frontend no Railway

```txt
Service Name: frontend
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npx vite preview --host 0.0.0.0 --port $PORT
VITE_API_URL=https://scriptura-web-api.vercel.app
```

## Backend no Railway

```txt
Service Name: backend
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
GROQ_API_KEY=gsk_sua_chave
NODE_ENV=production
CORS_ORIGIN=https://scriptura-web.vercel.app
```

## Validacao

1. Abra `https://scriptura-web-api.vercel.app/health`
2. Abra `https://scriptura-web.vercel.app`
3. Teste a geracao de conteudo

## Resumo de URLs

| Servico | Link |
| --- | --- |
| Frontend atual | https://scriptura-web.vercel.app |
| Backend atual | https://scriptura-web-api.vercel.app |
| Railway | https://railway.app/dashboard |
