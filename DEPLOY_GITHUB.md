# Guia Completo: GitHub + Deploy

## Repositorio

- GitHub: `https://github.com/NinsegaMasterJr/Gerador.P-Web`
- Projeto: `Gerador.P-Web`
- Marca atual: `Scriptura`

## Producoes Atuais

- Frontend: `https://scriptura-web.vercel.app`
- Backend: `https://scriptura-web-api.vercel.app`

## Enviar o Projeto para o GitHub

```powershell
cd "c:\Users\prdav\OneDrive\Trabalhos-Davi\Gerador.P-Web"
git init
git add .
git commit -m "Inicial: Scriptura Web"
git branch -M main
git remote add origin https://github.com/NinsegaMasterJr/Gerador.P-Web.git
git push -u origin main
```

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

## Testar

1. Abra `https://scriptura-web-api.vercel.app/health`
2. Abra `https://scriptura-web.vercel.app`
3. Verifique a geracao de conteudo

## Observacao

Se voce for publicar uma copia sua em outro dominio, troque as URLs acima pelas do seu ambiente.
