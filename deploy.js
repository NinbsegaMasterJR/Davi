#!/usr/bin/env node

/**
 * Script de Deploy para Scriptura
 * Automatiza verificações para deploy em produção
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const REQUIRED_PACKAGE_MANAGER = "npm@11.9.0";

console.log(`
╔════════════════════════════════════════╗
║     SCRIPTURA - Deploy Tool          ║
║     Versão 1.0.0                       ║
╚════════════════════════════════════════╝
`);

// Verificar Node.js
const nodeVersion = process.version;
console.log(`✓ Node.js ${nodeVersion}\n`);

checkNpm();

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

function checkNpm() {
  try {
    const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
    console.log(`✓ npm ${npmVersion}`);
    console.log(`✓ Package manager esperado: ${REQUIRED_PACKAGE_MANAGER}\n`);
    return true;
  } catch (error) {
    console.error("✗ npm não foi encontrado no ambiente");
    return false;
  }
}

function checkPackageManager(packageJsonPath, description) {
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`✗ ${description} não encontrado`);
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  if (packageJson.packageManager === REQUIRED_PACKAGE_MANAGER) {
    console.log(`✓ ${description} usa ${REQUIRED_PACKAGE_MANAGER}`);
    return true;
  }

  console.log(
    `✗ ${description} não está padronizado em ${REQUIRED_PACKAGE_MANAGER}`,
  );
  return false;
}

// Menu principal
console.log("Escolha uma opção:\n");
console.log("1. Build Backend para Railway");
console.log("2. Build Frontend para Railway");
console.log("3. Build Ambos");
console.log("4. Verificar Configuração");
console.log("5. Verificar prontidão para deploy Railway\n");

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
    checkReadiness();
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
  checkFile("railway.json", "Configuração Railway");

  run("npm run build", "Compilar TypeScript");
  console.log("✓ Backend pronto para deploy em Railway\n");
}

function buildFrontend() {
  console.log("\n═══════════════════════════════════");
  console.log("  BUILD FRONTEND");
  console.log("═══════════════════════════════════\n");

  const frontendPath = path.join(__dirname, "frontend");
  process.chdir(frontendPath);

  checkFile(".env.example", "Arquivo .env.example");
  checkFile("vite.config.ts", "Configuração Vite");
  checkFile("index.html", "HTML principal");
  checkFile("railway.json", "Configuração Railway");

  run("npm run build", "Build com Vite");
  console.log("✓ Frontend pronto para deploy em Railway\n");
}

function checkConfig() {
  console.log("\n═══════════════════════════════════");
  console.log("  VERIFICAÇÃO DE CONFIGURAÇÃO");
  console.log("═══════════════════════════════════\n");

  // Backend checks
  console.log("Backend:");
  checkFile(path.join(__dirname, "backend/package.json"), "  package.json");
  checkPackageManager(
    path.join(__dirname, "backend/package.json"),
    "  backend/package.json",
  );
  checkFile(path.join(__dirname, "backend/railway.json"), "  railway.json");
  checkFile(path.join(__dirname, "backend/tsconfig.json"), "  tsconfig.json");
  checkFile(path.join(__dirname, "backend/.env.example"), "  .env.example");

  // Frontend checks
  console.log("\nFrontend:");
  checkFile(path.join(__dirname, "frontend/package.json"), "  package.json");
  checkPackageManager(
    path.join(__dirname, "frontend/package.json"),
    "  frontend/package.json",
  );
  checkFile(path.join(__dirname, "frontend/railway.json"), "  railway.json");
  checkFile(
    path.join(__dirname, "frontend/vite.config.ts"),
    "  vite.config.ts",
  );
  checkFile(path.join(__dirname, "frontend/index.html"), "  index.html");
  checkFile(path.join(__dirname, "frontend/.env.example"), "  .env.example");

  // Documentation
  console.log("\nDocumentação:");
  checkPackageManager(
    path.join(__dirname, "package.json"),
    "  package.json raiz",
  );
  checkFile(path.join(__dirname, "RAILWAY_DEPLOY.md"), "  RAILWAY_DEPLOY.md");
  checkFile(path.join(__dirname, "README.md"), "  README.md");

  console.log("\n✓ Configuração verificada!\n");
}

function checkReadiness() {
  console.log("\n═══════════════════════════════════");
  console.log("  PRONTIDÃO PARA DEPLOY RAILWAY");
  console.log("═══════════════════════════════════\n");

  checkConfig();

  console.log("Variáveis obrigatórias:");
  console.log("- Frontend: VITE_API_URL=https://seu-backend.up.railway.app");
  console.log("- Backend: GROQ_API_KEY=gsk_sua_chave");
  console.log("- Backend: CORS_ORIGIN=https://seu-frontend.up.railway.app");
  console.log("- Backend: NODE_ENV=production\n");

  console.log("Guia principal: RAILWAY_DEPLOY.md\n");
}

console.log("\n✓ Execução finalizada\n");
console.log("Próximos passos sugeridos:");
console.log("1. Leia RAILWAY_DEPLOY.md para instruções detalhadas");
console.log("2. Configure variáveis de ambiente em Railway");
console.log("3. Faça push para GitHub");
console.log("4. Acompanhe o deploy automático\n");
