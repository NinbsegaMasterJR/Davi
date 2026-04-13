# Guia Completo: GitHub + Deploy

## Repositorio

- GitHub: `https://github.com/NinbsegaMasterJR/Davi`
- Projeto: `Gerador.P-Web`
- Marca atual: `Scriptura`

## Producoes Atuais

- Frontend: `https://pregador-ia.vercel.app`
- Backend: `https://pregador-ia-api.vercel.app`

## Enviar o Projeto para o GitHub

```powershell
cd "c:\Users\prdav\OneDrive\Trabalhos-Davi\Gerador.P-Web"
git init
git add .
git commit -m "Inicial: Scriptura Web"
git branch -M main
git remote add origin https://github.com/NinbsegaMasterJR/Davi.git
git push -u origin main
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

## Testar

1. Abra `https://pregador-ia-api.vercel.app/health`
2. Abra `https://pregador-ia.vercel.app`
3. Verifique a geracao de conteudo

## Observacao

Se voce for publicar uma copia sua em outro dominio, troque as URLs acima pelas do seu ambiente.
