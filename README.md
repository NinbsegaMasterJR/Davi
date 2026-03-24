# 🙏 Pregador IA - Versão Web

Uma transformação completa do Gerador.P (extensão VS Code) em um **site web full-stack** para assistência inteligente em preparação de pregações.

## 📋 Características

- ✨ **Gerar Esboço de Pregações** - Crie esboços estruturados com IA
- 📖 **Sugerir Versículos** - Busque versículos bíblicos por tema
- 🔍 **Análise Teológica** - Análises profundas de temas teológicos
- 📅 **Cronograma de Pregações** - Planeje suas pregações
- 🔗 **Concordância Bíblica** - Busque palavras na Bíblia

## 🏗️ Arquitetura

### Backend (Express.js + TypeScript)

```
backend/
├── src/
│   ├── server.ts                 # Servidor principal
│   ├── services/
│   │   ├── ia.service.ts         # Integração OpenAI
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

### ⚡ Quick Start (Uma Clique!)

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
- npm ou yarn
- Chave de API OpenAI
- Chave de API Bible (opcional)

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
OPENAI_API_KEY=seu_openai_key_aqui
BIBLE_API_KEY=sua_bible_api_key_aqui
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

### OpenAI (Claude)

O sistema usa Claude 3.5 Sonnet para:

- Geração de esboços com estrutura teológica
- Análises teológicas profundas
- Explicações de passagens bíblicas
- Adaptação ao estilo de cada igreja

**Prompt engineering:**

- Esboços consideram duração da pregação
- Análises incluem contexto histórico e aplicação moderna
- Explicações são estruturadas com múltiplas seções

### Bible API

Para implementação completa, integre com:

- **BibleAPI.com** - Textos completos da Bíblia
- **Scripture.api.bible** - Múltiplas versões
- **Bíblia digital local** - Arquivo JSON/SQLite

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

## 🔐 Segurança

- ✅ Variáveis de ambiente para chaves sensíveis
- ✅ CORS configurável
- ✅ Validação de entrada
- ✅ Tratamento de erros robusto

## ☁️ Colocar no Ar (Deploy)

**Leia este arquivo PRIMEIRO:** [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)

### Opções de Hosting Gratuitas

#### Frontend (Vercel)

```bash
1. Clique em: https://vercel.com/new
2. Conecte seu repositório GitHub
3. Se perguntado pelo "Root Directory", escolha: frontend
4. Clique "Deploy"
```

**Pronto em:** ~2 minutos  
**Seu site:** https://seu-projeto.vercel.app

#### Backend (Render)

```bash
1. Clique em: https://render.com/new
2. Selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure variáveis de ambiente:
   - ANTHROPIC_API_KEY (obtenha em https://console.anthropic.com)
   - CORS_ORIGIN (seu URL do Vercel)
5. Clique "Create"
```

**Pronto em:** ~5 minutos  
**Sua API:** https://seu-api.onrender.com

---

## 🎯 Próximas Etapas

1. **Integrar Bible APIs reais** - Implementar buscas de versículos autênticas
2. **Adicionar persistência** - Banco de dados para salvar pregações
3. **Autenticação** - Login e conta do usuário
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
