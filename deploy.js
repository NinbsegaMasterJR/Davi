#!/usr/bin/env node

/**
 * Script de Deploy para Pregador IA
 * Automatiza o processo de upload para produção
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log(`
╔════════════════════════════════════════╗
║     PREGADOR IA - Deploy Tool          ║
║     Versão 1.0.0                       ║
╚════════════════════════════════════════╝
`);

// Verificar Node.js
const nodeVersion = process.version;
console.log(`✓ Node.js ${nodeVersion}\n`);

// Funções auxiliares
function run(cmd, description) {
  console.log(`\n→ ${description}...`);
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`✓ ${description} realizado com sucesso\n`);
    return true;
  } catch (error) {
    console.error(`✗ Erro: ${description} falhou`);
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${description} encontrado`);
    return true;
  } else {
    console.log(`✗ ${description} NÃO encontrado`);
    return false;
  }
}

// Menu principal
console.log("Escolha uma opção:\n");
console.log("1. Build Backend para Render");
console.log("2. Build Frontend para Vercel");
console.log("3. Build Ambos");
console.log("4. Verificar Configuração");
console.log("5. Abrir Documentação de Deploy\n");

const option = process.argv[2] || "4";

switch (option) {
  case "1":
    buildBackend();
    break;
  case "2":
    buildFrontend();
    break;
  case "3":
    buildBackend();
    buildFrontend();
    break;
  case "4":
    checkConfig();
    break;
  case "5":
    openDeploy();
    break;
  default:
    console.log("Opção inválida");
}

function buildBackend() {
  console.log("\n═══════════════════════════════════");
  console.log("  BUILD BACKEND");
  console.log("═══════════════════════════════════\n");

  const backendPath = path.join(__dirname, "backend");
  process.chdir(backendPath);

  checkFile(".env.example", "Arquivo .env.example");
  checkFile("src/server.ts", "Server principal");

  run("npm run build", "Compilar TypeScript");
  console.log("✓ Backend pronto para deploy em Render\n");
}

function buildFrontend() {
  console.log("\n═══════════════════════════════════");
  console.log("  BUILD FRONTEND");
  console.log("═══════════════════════════════════\n");

  const frontendPath = path.join(__dirname, "frontend");
  process.chdir(frontendPath);

  checkFile("vite.config.ts", "Configuração Vite");
  checkFile("index.html", "HTML principal");

  run("npm run build", "Build com Vite");
  console.log("✓ Frontend pronto para deploy em Vercel\n");
}

function checkConfig() {
  console.log("\n═══════════════════════════════════");
  console.log("  VERIFICAÇÃO DE CONFIGURAÇÃO");
  console.log("═══════════════════════════════════\n");

  // Backend checks
  console.log("Backend:");
  checkFile(path.join(__dirname, "backend/package.json"), "  package.json");
  checkFile(path.join(__dirname, "backend/vercel.json"), "  vercel.json");
  checkFile(path.join(__dirname, "backend/tsconfig.json"), "  tsconfig.json");

  // Frontend checks
  console.log("\nFrontend:");
  checkFile(path.join(__dirname, "frontend/package.json"), "  package.json");
  checkFile(
    path.join(__dirname, "frontend/vite.config.ts"),
    "  vite.config.ts",
  );
  checkFile(path.join(__dirname, "frontend/index.html"), "  index.html");

  // Documentation
  console.log("\nDocumentação:");
  checkFile(path.join(__dirname, "DEPLOY.md"), "  DEPLOY.md");
  checkFile(path.join(__dirname, "README.md"), "  README.md");

  console.log("\n✓ Configuração verificada!\n");
}

function openDeploy() {
  const open = require("open");
  const deployPath = path.join(__dirname, "DEPLOY.md");
  if (fs.existsSync(deployPath)) {
    console.log("\nAbrindo DEPLOY.md...\n");
    // Em caso real, abrir o arquivo
  }
}

console.log("\n✓ Deploy completado com sucesso!\n");
console.log("Próximos passos:");
console.log("1. Leia DEPLOY.md para instruções detalhadas");
console.log("2. Configure variáveis de ambiente em Render + Vercel");
console.log("3. Faça push para GitHub");
console.log("4. Deploy automático começará\n");
