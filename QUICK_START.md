# Guia de Instalacao Rapida

Use npm em todo o projeto. O repositorio esta fixado em `npm@11.9.0`.

## Producoes Atuais

- Frontend: `https://pregador-ia.vercel.app`
- Backend: `https://pregador-ia-api.vercel.app`

## 1. Backend

```bash
cd backend
npm install
npm run dev
```

Exemplo de `.env`:

```env
PORT=3001
NODE_ENV=development
GROQ_API_KEY=sua_chave
CORS_ORIGIN=http://localhost:3000
```

## 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## 3. Acesse

- Local: `http://localhost:3000`
- Producao: `https://pregador-ia.vercel.app`

## 4. Health Check

```bash
curl http://localhost:3001/health
curl https://pregador-ia-api.vercel.app/health
```

Resposta esperada:

```json
{
  "status": "OK",
  "message": "Scriptura API is running"
}
```
