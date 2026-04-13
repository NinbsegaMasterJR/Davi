# Colocar Scriptura no Ar - Guia Rapido

## URLs Atuais

- Frontend: `https://pregador-ia.vercel.app`
- Backend: `https://pregador-ia-api.vercel.app`

## TL;DR

1. Configure as variaveis de ambiente.
2. Rode `npm run lint` e `npm run build`.
3. Publique frontend e backend.
4. Teste `/health` e a geracao de conteudo.

## Variaveis

### Frontend

```env
VITE_API_URL=https://pregador-ia-api.vercel.app
```

### Backend

```env
GROQ_API_KEY=gsk_sua_chave
NODE_ENV=production
CORS_ORIGIN=https://pregador-ia.vercel.app
```

## Teste Rapido

```txt
https://pregador-ia-api.vercel.app/health
```

Resposta esperada:

```json
{ "status": "OK", "message": "Scriptura API is running" }
```

## Referencias

- Deploy resumido: [DEPLOY.md](DEPLOY.md)
- Railway: [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)
