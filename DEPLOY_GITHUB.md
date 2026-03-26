# 🚀 Guia Completo: GitHub + Railway

## Informações do projeto

- Usuário GitHub: NinsegaMasterJr
- Repositório: Gerador.P-Web
- Método: GitHub + Railway
- Package manager: npm 11.9.0

## PASSO 1: Criar o repositório no GitHub

1. Vá para https://github.com/new
2. Crie o repositório `Gerador.P-Web`
3. Deixe a inicialização vazia se já tiver o código local

## PASSO 2: Enviar o projeto local

Pré-requisito: Git instalado no Windows.

```powershell
cd "c:\Users\prdav\OneDrive\Trabalhos-Davi\Gerador.P-Web"
git init
git add .
git commit -m "Inicial: Pregador IA Web"
git branch -M main
git remote add origin https://github.com/NinsegaMasterJr/Gerador.P-Web.git
git push -u origin main
```

## PASSO 3: Criar o projeto no Railway

1. Acesse https://railway.app
2. Crie um projeto conectado ao GitHub
3. Selecione o repositório `Gerador.P-Web`

## PASSO 4: Criar o serviço frontend

Configure assim:

```txt
Service Name: frontend
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npx vite preview --host 0.0.0.0 --port $PORT
```

Variável de ambiente:

```txt
VITE_API_URL=https://seu-backend.up.railway.app
```

## PASSO 5: Criar o serviço backend

Configure assim:

```txt
Service Name: backend
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

Variáveis de ambiente:

```txt
GROQ_API_KEY=gsk_sua_chave
CORS_ORIGIN=https://seu-frontend.up.railway.app
NODE_ENV=production
```

## PASSO 6: Testar produção

1. Abra `https://seu-backend.up.railway.app/health`
2. Abra o frontend publicado
3. Teste esboço, versículos, análise, concordância e explicação de passagem

## Checklist final

- [ ] Repositório criado no GitHub
- [ ] Código enviado com `git push`
- [ ] Serviço frontend criado no Railway
- [ ] Serviço backend criado no Railway
- [ ] `VITE_API_URL` configurada
- [ ] `GROQ_API_KEY` configurada
- [ ] `CORS_ORIGIN` configurada
- [ ] Site testado em produção

## Observação

Para o passo a passo mais detalhado, use [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md).
