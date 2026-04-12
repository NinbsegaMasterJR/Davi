import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const port = process.env.PORT || "3000";
const serveCliPath = fileURLToPath(
  new URL("../node_modules/serve/build/main.js", import.meta.url),
);

const child = spawn(
  process.execPath,
  [serveCliPath, "-s", "dist", "-l", `tcp://0.0.0.0:${port}`],
  {
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
