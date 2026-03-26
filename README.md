# 🙏 Pregador IA - Versão Web

Uma transformação completa do Gerador.P (extensão VS Code) em um **site web full-stack** para assistência inteligente em preparação de pregações.

## 📋 Características

- ✨ **Gerar Esboço de Pregações** - Crie esboços estruturados com IA
- 📖 **Sugerir Versículos** - Busque versículos bíblicos por tema
- 🔍 **Análise Teológica** - Análises profundas de temas teológicos
- 📅 **Cronograma de Pregações** - Planeje temas mensais com IA
- 🔗 **Concordância Bíblica** - Busque palavras e conceitos na Bíblia
- ✝️ **Explicar Passagem** - Gere explicações detalhadas de textos bíblicos

## 🏗️ Arquitetura

### Backend (Express.js + TypeScript)

```
backend/
├── src/
│   ├── server.ts                 # Servidor principal
│   ├── services/
│   │   ├── ia.service.ts         # Integração Groq
│   │   └── bible.service.ts      # Dados bíblicos
│   └── routes/
│       ├── sermon.routes.ts      # Esboços e análises
│       ├── verses.routes.ts      # Versículos
│       ├── concordance.routes.ts # Concordância
│       └── analysis.routes.ts    # Análises teológicas
├── package.json
├── tsconfig.json
└── .env.example
```

### Frontend (React + Vite)

```
frontend/
├── src/
│   ├── pages/
│   │   └── Home.tsx              # Página principal
│   ├── components/
│   │   ├── SermonOutline.tsx     # Gerar esboço
│   │   ├── VersesSuggestion.tsx  # Sugerir versículos
│   │   ├── TheologicalAnalysis.tsx # Análise teológica
│   │   └── [Componentes CSS]
│   ├── services/
│   │   └── api.ts                # Cliente HTTP
│   ├── context/
│   │   └── AppContext.tsx        # Gerenciador de estado
│   └── main.tsx                  # Entrada
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Instalação e Configuração

### ⚡ Quick Start (Um clique)

**Windows:** Duplo-clique em `iniciar.bat`

```
iniciar.bat
```

Isso vai:

- ✅ Abrir o Backend (porta 3001)
- ✅ Abrir o Frontend (porta 3000)
- ✅ Abrir o navegador automaticamente

**Linux/Mac:**

```bash
chmod +x iniciar.sh
./iniciar.sh
```

---

### 🔧 Instalação Manual

- Node.js 16+
- npm 11.9.0
- Chave de API Groq

O projeto está padronizado com `packageManager: npm@11.9.0` nos `package.json`. Use npm em todos os comandos deste repositório.

### Backend

1. **Navegue para a pasta backend:**

```bash
cd backend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e adicione suas chaves
GROQ_API_KEY=sua_chave_groq_aqui
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

4. **Inicie o servidor:**

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Frontend

1. **Em outra aba do terminal, navegue para a pasta frontend:**

```bash
cd frontend
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

O site estará acessível em `http://localhost:3000`

## 🔌 Endpoints da API

### Esboços de Pregação

```
POST /api/sermons/outline
Body: {
  "tema": "Fé",
  "estilo": "Pentecostal",
  "duracao": 30
}
```

```
POST /api/sermons/analysis
Body: {
  "tema": "Santificação",
  "passagem": "Romanos 6:19"
}
```

```
POST /api/sermons/explain
Body: {
  "referencia": "João 3:16"
}
```

### Versículos

```
GET /api/verses/suggest?tema=Amor&limite=5
GET /api/verses/João%203:16
```

### Concordância

```
GET /api/concordance/search?palavra=Fé&limite=10
```

### Análise Teológica

```
POST /api/analysis/theological
Body: {
  "tema": "Justificação",
  "profundidade": "avancado"
}
```

## 🤖 Integração com IA

### Groq

O sistema usa Groq com LLM para:

- Geração de esboços com estrutura teológica
- Análises teológicas profundas
- Explicações de passagens bíblicas
- Adaptação ao estilo de cada igreja

**Prompt engineering:**

- Esboços consideram duração da pregação
- Análises incluem contexto histórico e aplicação moderna
- Explicações são estruturadas com múltiplas seções

Atualmente as sugestões bíblicas e concordância são geradas pela camada de IA.
Se quiser maior precisão textual no futuro, você pode integrar uma API bíblica dedicada.

## 🎨 Componentes Frontend

### SermonOutline

- Input de tema, estilo e duração
- Renderização Markdown do resultado
- Botão para copiar para área de transferência

### VersesSuggestion

- Busca por tema
- Seleção de quantidade de versículos
- Cards com referência e texto

### TheologicalAnalysis

- Input de tema e passagem opcional
- Seleção de nível de profundidade
- Análise completa em Markdown

## 📦 Build para Produção

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Os arquivos estarão em dist/
```

## 🚂 Deploy no Railway

O fluxo recomendado é usar dois serviços separados no Railway:

- Serviço `backend` com root directory `backend`
- Serviço `frontend` com root directory `frontend`

Variáveis mínimas:

### Backend

```bash
GROQ_API_KEY=gsk_sua_chave_aqui
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.up.railway.app
```

### Frontend

```bash
VITE_API_URL=https://seu-backend.up.railway.app
```

Veja [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md) para o passo a passo.

## 🔐 Segurança

- ✅ Variáveis de ambiente para chaves sensíveis
- ✅ CORS configurável
- ✅ Validação de entrada
- ✅ Tratamento de erros robusto

## ☁️ Colocar no Ar (Deploy)

**Leia este arquivo PRIMEIRO:** [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)

### Plataforma recomendada

#### Frontend e Backend no Railway

```bash
1. Crie um projeto em https://railway.app
2. Conecte seu repositório GitHub
3. Crie um serviço com Root Directory: frontend
4. Crie outro serviço com Root Directory: backend
```

**Variáveis obrigatórias:**

- Frontend: `VITE_API_URL=https://seu-backend.up.railway.app`
- Backend: `GROQ_API_KEY`, `CORS_ORIGIN=https://seu-frontend.up.railway.app`, `NODE_ENV=production`

**Tempo médio:** ~5 minutos por serviço  
**Guia completo:** [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)

---

## 🎯 Próximas Etapas

1. **Adicionar persistência** - Banco de dados para salvar esboços e históricos
2. **Criar autenticação** - Login e contas de usuário
3. **Melhorar observabilidade** - Logs, métricas e monitoramento de erros
4. **Histórico** - Salvar esboços anteriores
5. **Share** - Compartilhar pregações por link
6. **Upload** - Importar suas próprias notas
7. **Mobile** - App responsivo melhorado
8. **Offline** - Funcionar sem internet

## 📄 Licença

MIT - Livre para uso pessoal e comercial

## 👤 Autor

Davi Trabalhos

---

**Desenvolvido com ❤️ para pregadores e pastores**
