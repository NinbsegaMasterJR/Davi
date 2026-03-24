# 🚀 Guia Completo: Deploy para GitHub, Vercel e Render

## Informações do Seu Projeto
- **Usuário GitHub**: NinsegaMasterJr
- **Nome do Repositório**: Gerador.P-Web (ou qualquer nome que escolher)
- **Método**: Via GitHub + Vercel + Render

---

## PASSO 1: Gerar Personal Access Token (PAT) no GitHub

### 1.1 Acesse GitHub e crie um token
1. Vá para https://github.com/settings/tokens/new
2. Faça login com sua conta GitHub se solicitado
3. Preencha com:
   - **Note**: `Gerador.P-Web Deployment`
   - **Expiration**: `90 days` (ou maior)
   - **Scopes** (marque):
     - ✅ `repo` (acesso completo a repositórios privados/públicos)
     - ✅ `workflow` (acesso a GitHub Actions)

4. Clique em **"Generate token"**
5. **COPIE O TOKEN** (você não conseguirá vê-lo novamente!)
   - Salve em um local seguro por enquanto

### 1.2 Token gerado? Continuar com Passo 2 ✓

---

## PASSO 2: Criar Repositório no GitHub

### 2.1 Crie o repositório
1. Vá para https://github.com/new
2. Preencha assim:
   - **Repository name**: `Gerador.P-Web`
   - **Description**: `Assistente de Inteligência Artificial para Pregações`
   - **Visibility**: `Public` (para deploy grátis no Vercel/Render)
   - **Initialize**: Deixe desmarcado (vamos fazer localmente)
3. Clique em **"Create repository"**

### 2.2 Você verá uma página com instruções
Salve essa URL: `https://github.com/NinsegaMasterJr/Gerador.P-Web.git`

---

## PASSO 3: Fazer Push Local Para GitHub (via PowerShell)

### ⚠️ Pré-requisito: Git instalado
Se não tiver Git instalado:
- Windows: Baixe em https://git-scm.com/download/win
- Instale com as opções padrão
- **Reinicie o PowerShell** após instalar

### 3.1 Configure Git (primeira vez apenas)
```powershell
git config --global user.name "Seu Nome Aqui"
git config --global user.email "seu-email@gmail.com"
```

### 3.2 Navegue até a pasta do projeto
```powershell
cd "c:\Users\prdav\OneDrive\Trabalhos-Davi\Gerador.P-Web"
```

### 3.3 Inicialize o repositório Git
```powershell
git init
```

### 3.4 Adicione todos os arquivos
```powershell
git add .
```

### 3.5 Crie o primeiro commit
```powershell
git commit -m "Inicial: Pregador IA - Assistente de Inteligência Artificial para Pregações"
```

### 3.6 Renomeie a branch para main (se necessário)
```powershell
git branch -M main
```

### 3.7 Adicione o repositório remoto
```powershell
git remote add origin https://github.com/NinsegaMasterJr/Gerador.P-Web.git
```

### 3.8 Faça o push para GitHub
```powershell
git push -u origin main
```

**Quando pedir credenciais:**
- Username: `NinsegaMasterJr`
- Password: **Cole o Personal Access Token completo** (Passo 1)

**✓ Se funcionar**: Você verá "Counting objects", "Compressing objects", etc.

---

## PASSO 4: Deploy no Vercel (Frontend)

### 4.1 Acesse Vercel
1. Vá para https://vercel.com/new
2. Clique em **"Continue with GitHub"**
3. Autorize o acesso ao seu GitHub

### 4.2 Importe o repositório
1. Procure por `Gerador.P-Web`
2. Clique em **"Import"**

### 4.3 Configure o projeto
1. **Framework Preset**: Vite
2. **Root Directory**: `/frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4.4 Environment Variables
- Não é necessária nenhuma para o frontend local

### 4.5 Deploy!
Clique em **"Deploy"** e aguarde (2-3 minutos)

**✓ URL do frontend**: `https://seu-projeto.vercel.app`

---

## PASSO 5: Deploy no Render (Backend)

### 5.1 Acesse Render
1. Vá para https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Selecione **"Deploy an existing Git repository"**
4. Clique em **"Connect Account"** (autorize GitHub)

### 5.2 Configure o serviço
1. **Name**: `pregador-ia-backend`
2. **Environment**: `Node`
3. **Region**: `São Paulo (sua região mais próxima)`
4. **Branch**: `main`
5. **Root Directory**: `backend`
6. **Build Command**: `npm install && npm run build`
7. **Start Command**: `npm start`

### 5.3 Environment Variables (CRÍTICO!)
Clique em **"Environment"** e adicione:
```
ANTHROPIC_API_KEY = sua-chave-da-api-anthropic
```

**Como obter a chave Anthropic:**
1. Vá para https://console.anthropic.com/
2. Crie uma conta ou faça login
3. Vá para **"API Keys"**
4. Clique em **"Create Key"**
5. Salve a chave com segurança

### 5.4 Deploy!
Clique em **"Create Web Service"** e aguarde (3-5 minutos)

**✓ URL do backend**: `https://seu-servico.onrender.com`

---

## PASSO 6: Conectar Frontend com Backend

### 6.1 Atualize o arquivo de configuração
No seu projeto, em `/frontend/src/config.ts`:

```typescript
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://seu-servico.onrender.com'  // URL do Render
  : 'http://localhost:3001';

export default API_URL;
```

### 6.2 Faça o push das mudanças
```powershell
cd "c:\Users\prdav\OneDrive\Trabalhos-Davi\Gerador.P-Web"
git add .
git commit -m "Configurar URLs de produção para Vercel e Render"
git push origin main
```

**Vercel e Render farão auto-deploy automaticamente!** ✨

---

## PASSO 7: Teste o Site em Produção

### 7.1 Teste o Frontend
- Acesse: `https://seu-projeto.vercel.app`
- Tente gerar um esboço
- Verifique a página "Sobre"

### 7.2 Teste o Backend
- Acesse: `https://seu-servico.onrender.com/health`
- Deve retornar: `{"status":"healthy"}`

### 7.3 Teste a Integração
- No site, tente usar qualquer recurso (esboço, versículos, análise)
- Se funcionar = **SUCCESS!** 🎉

---

## 🆘 Troubleshooting

### Problema: "401 Unauthorized" no push
**Solução**: Use seu Personal Access Token, não sua senha do GitHub

### Problema: Backend não funciona no Render
**Checklist**:
- [ ] ANTHROPIC_API_KEY está configurada no Render?
- [ ] URL do Render está correta em `/frontend/src/config.ts`?
- [ ] Fez `git push` depois de mudar a config?

### Problema: Frontend não conecta ao backend
**Solução**: Em `/backend/src/server.ts`, verifique CORS:
```typescript
const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    // Permite Vercel
    if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(null, true); // Permite todos para desenvolvimento
    }
  },
  credentials: true,
};
```

---

## ✅ Checklist Final

- [ ] Git instalado e configurado
- [ ] Personal Access Token gerado
- [ ] Repositório criado no GitHub
- [ ] Código feito push para GitHub
- [ ] Vercel conectado e frontend deployado
- [ ] Render conectado com ANTHROPIC_API_KEY
- [ ] Backend deployado no Render
- [ ] Config atualizada com URLs de produção
- [ ] Site testado e funcionando

---

## 📊 Resumo de URLs

| Serviço | Local | Produção |
|---------|-------|----------|
| Frontend | http://localhost:3000 | https://seu-projeto.vercel.app |
| Backend | http://localhost:3001 | https://seu-servico.onrender.com |
| GitHub | - | https://github.com/NinsegaMasterJr/Gerador.P-Web |

---

## 🎯 Próximas Etapas

1. **Compartilhar com usuários**: Use a URL do Vercel
2. **Monitorar acesso**: Vercel e Render têm dashboards de analytics
3. **Futuros deploys**: Faça `git push` e tudo atualiza automaticamente!
4. **Banco de dados** (opcional): Integrar MongoDB/PostgreSQL para salvar esboços

---

**Dúvidas? Abra uma issue no GitHub!** 🚀
