# Scriptura - Versao Web

Aplicacao web full-stack para preparar esbocos, estudos e materiais biblicos com apoio de IA.

## URLs Atuais

- Frontend: `https://pregador-ia.vercel.app`
- Backend: `https://pregador-ia-api.vercel.app`
- GitHub: `https://github.com/NinbsegaMasterJR/Davi`

## Principais Recursos

- Geracao de esboco de pregacao
- Sugestao de versiculos por tema
- Analise teologica
- Explicacao de passagem
- Concordancia biblica
- Cronograma de pregacoes
- Carta pastoral
- Workspace local e sincronizacao em nuvem

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- IA: Groq
- Deploy atual: Vercel
- Package manager: `npm@11.9.0`

## Estrutura

```txt
backend/
  src/
  package.json

frontend/
  src/
  package.json
```

## Desenvolvimento Local

### Backend

```bash
cd backend
npm install
npm run dev
```

Variaveis minimas:

```env
PORT=3001
NODE_ENV=development
GROQ_API_KEY=sua_chave
CORS_ORIGIN=http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
npm run lint
npm run build
```

## Producao Atual

Health check da API:

```txt
https://pregador-ia-api.vercel.app/health
```

Resposta esperada:

```json
{
  "status": "OK",
  "message": "Scriptura API is running"
}
```

## Variaveis de Producao

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

## Deploy

- Resumo rapido: [DEPLOY.md](DEPLOY.md)
- Guia rapido: [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)
- Dominio proprio: [DOMINIO_PROPRIO.md](DOMINIO_PROPRIO.md)
- GitHub + deploy: [DEPLOY_GITHUB.md](DEPLOY_GITHUB.md)
- Railway: [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)

Observacao:
Se voce publicar em outro dominio, troque `VITE_API_URL` e `CORS_ORIGIN` pelas URLs do seu ambiente.

## Suporte

- Site: `https://pregador-ia.vercel.app`
- API: `https://pregador-ia-api.vercel.app`
- Issues: `https://github.com/NinbsegaMasterJR/Davi/issues`

## Licenca

MIT
