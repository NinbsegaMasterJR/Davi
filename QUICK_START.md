# Guia de Instalacao Rapida

Use npm em todo o projeto. O repositorio esta fixado em `npm@11.9.0`.

## Producoes Atuais

- Frontend: `https://scriptura-web.vercel.app`
- Backend: `https://scriptura-web-api.vercel.app`

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
- Producao: `https://scriptura-web.vercel.app`

## 4. Health Check

```bash
curl http://localhost:3001/health
curl https://scriptura-web-api.vercel.app/health
```

Resposta esperada:

```json
{
  "status": "OK",
  "message": "Scriptura API is running"
}
```
