# Deploy Guide - Scriptura

## URLs Publicas Atuais

- Frontend: `https://scriptura-web.vercel.app`
- Backend: `https://scriptura-web-api.vercel.app`

## Stack de Publicacao

- Frontend: Vercel
- Backend: Vercel
- Package manager: `npm@11.9.0`

## Variaveis de Producao

### Frontend

```env
VITE_API_URL=https://scriptura-web-api.vercel.app
```

### Backend

```env
GROQ_API_KEY=gsk_sua_chave
NODE_ENV=production
CORS_ORIGIN=https://scriptura-web.vercel.app
```

## Validacao

1. Abra `https://scriptura-web-api.vercel.app/health`
2. Abra `https://scriptura-web.vercel.app`
3. Teste esboco, analise, versiculos e workspace

Resposta esperada:

```json
{ "status": "OK", "message": "Scriptura API is running" }
```

## Redeploy

```bash
npm run lint
npm run build
```

Se publicar em outro ambiente, substitua `VITE_API_URL` e `CORS_ORIGIN` pelas URLs do novo dominio.
