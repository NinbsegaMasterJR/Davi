# Guia de Instalação Rápida

Use npm em todo o projeto. O repositório está fixado em `npm@11.9.0`.

## 1️⃣ Backend

```bash
cd backend
npm install
cp .env.example .env

# Editar .env com suas chaves
# GROQ_API_KEY=gsk_...
# CORS_ORIGIN=http://localhost:3000

npm run dev
```

## 2️⃣ Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

## 3️⃣ Acesse

Abra seu navegador em: **http://localhost:3000**

## ⚙️ Variáveis de Ambiente

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
CORS_ORIGIN=http://localhost:3000
```

## 📚 API Health Check

De dentro de um terminal ou navegador:

```bash
curl http://localhost:3001/health
```

Resposta esperada:

```json
{
  "status": "OK",
  "message": "Pregador IA API is running"
}
```

## 🐛 Troubleshooting

**Porta 3001 já em uso?**

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

**Erro de CORS?**
Verifique se CORS_ORIGIN no .env corresponde ao seu frontend URL

**Erro na IA?**
Confira se `GROQ_API_KEY` está correta e com acesso ativo

---

Sucesso! Divirta-se! 🚀
