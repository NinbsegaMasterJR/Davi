# Dominio Proprio - Scriptura

Este guia mostra como apontar um dominio proprio para o Scriptura sem tirar do ar as URLs atuais:

- Frontend atual: `https://pregador-ia.vercel.app`
- Backend atual: `https://pregador-ia-api.vercel.app`

## Antes de comecar

Voce precisa ter acesso ao painel do provedor onde o dominio foi comprado, como Registro.br, Cloudflare, Hostinger, GoDaddy ou outro DNS.

Escolha os nomes finais antes de configurar. Uma sugestao simples:

- Site: `scriptura.seudominio.com`
- API: `api.scriptura.seudominio.com`

Tambem funciona usar o dominio raiz para o site:

- Site: `seudominio.com`
- API: `api.seudominio.com`

## Configurar no Vercel

1. Abra o projeto do frontend no Vercel.
2. Entre em `Settings > Domains`.
3. Adicione o dominio do site, por exemplo `scriptura.seudominio.com`.
4. Repita o processo no projeto do backend e adicione o dominio da API, por exemplo `api.scriptura.seudominio.com`.
5. O Vercel vai mostrar os registros DNS necessarios.

## Configurar DNS

Para subdominios, normalmente o Vercel pede um registro `CNAME`:

```txt
Tipo: CNAME
Nome: scriptura
Valor: cname.vercel-dns.com
```

Para o backend:

```txt
Tipo: CNAME
Nome: api.scriptura
Valor: cname.vercel-dns.com
```

Se usar o dominio raiz, o Vercel pode pedir um registro `A`:

```txt
Tipo: A
Nome: @
Valor: 76.76.21.21
```

Use sempre os valores exatos exibidos no painel do Vercel, porque eles podem variar conforme o projeto.

## Atualizar variaveis

Depois que os dominios estiverem verificados, ajuste as variaveis de producao.

Frontend:

```env
VITE_API_URL=https://api.scriptura.seudominio.com
```

Backend:

```env
CORS_ORIGIN=https://scriptura.seudominio.com
NODE_ENV=production
GROQ_API_KEY=gsk_sua_chave
```

Se quiser aceitar tambem o dominio antigo durante a transicao, configure `CORS_ORIGIN` com a lista suportada pelo backend ou mantenha o dominio antigo ate confirmar a mudanca.

## Publicar de novo

Depois de mudar as variaveis, faca novo deploy dos dois projetos:

```bash
npm run lint
npm run build
```

Depois publique no Vercel e valide:

```txt
https://api.scriptura.seudominio.com/health
https://scriptura.seudominio.com
```

## Checklist de validacao

- O Vercel mostra o dominio como `Valid Configuration`.
- O certificado HTTPS foi emitido.
- `/health` da API responde `status: OK`.
- O frontend consegue gerar conteudo sem erro de CORS.
- O dominio antigo continua funcionando ate a migracao estar confirmada.

## Observacao importante

Este repositorio deixa o projeto pronto para dominio proprio, mas o apontamento real depende do dominio comprado e do acesso ao painel de DNS.
